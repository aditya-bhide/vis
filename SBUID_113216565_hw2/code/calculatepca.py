from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS
import numpy as np
import math
import pandas as pd
import pprint

data_raw = pd.read_csv('Rice-Gonen andJasmine.csv')
remove_categorical = ['Class']
dataset_total = data_raw.sample(frac=0.01, random_state=23)
dataset_total['Class'] = pd.factorize(dataset_total.Class)[0]
dataset_total_npy = dataset_total.to_numpy()
features_total = dataset_total.columns
dataset = dataset_total.drop(columns = remove_categorical)
features = dataset.columns
data_npy = dataset.to_numpy()
# Read data from sklearn load as same wine dataset is available there.

# wine = load_wine()
# features = wine.feature_names
# data_npy = wine.data
# dataset = pd.DataFrame(data_npy)
# features = [i.replace("_", " ") for i in features]
# dataset.columns = features

num_clusters = 3

std_sklr = StandardScaler()
x = std_sklr.fit_transform(X = data_npy)
pca_data = PCA(n_components=len(features))
norm_principalComponents_data = pca_data.fit_transform(x)

min_max_sklr = MinMaxScaler(feature_range=(-1,1))
norm_principalComponents_data = min_max_sklr.fit_transform(X = norm_principalComponents_data)
eigen_values = pca_data.explained_variance_


def get_data(): 
    scree_plot = {}
    eigen_total = sum(eigen_values)
    variance_percentage = []
    for i in  eigen_values:
        variance_percentage.append((i/eigen_total)*100)
    
    cumulative_variance = []
    temp = 0
    for i in variance_percentage:
        temp += i
        cumulative_variance.append(temp)
 
    for i in range(0, len(eigen_values)):
        scree_plot[i+1] = {"variance_percentage" : variance_percentage[i], "cumulative_variance": cumulative_variance[i]}
    return scree_plot

def get_top_pca():
    feature_contri = {}
    count = 0
    for i, j, k in zip(features, pca_data.components_[0], pca_data.components_[1]):
        feature_contri[count] = {}
        feature_contri[count]["name"] = i
        feature_contri[count]["pc1"] = j
        feature_contri[count]["pc2"] = k
        count += 1
        
    top_pca = norm_principalComponents_data[:,:2]
    plot_pca = {}
    for i in range(0, len(top_pca)):
        plot_pca[i] = {}
        plot_pca[i]['pc1'] = top_pca[i, 0]
        plot_pca[i]['pc2'] = top_pca[i, 1]
        
    return feature_contri, plot_pca

def get_top_four_features(di = 3):
    squared_value = pca_data.components_[:di] ** 2

    features_dict = {}
    for i in range(0, len(squared_value[0])):
        total = 0
        for j in range(0, len(squared_value)):
            total += squared_value[j][i]
        features_dict[features[i]] = total

    sorted_features_dict = [k for k, v in sorted(features_dict.items(), key=lambda item: item[1])]
    sorted_features_dict = sorted_features_dict[::-1]
    best_four_features = sorted_features_dict[:4]
    
    values_best_best_four_features = {}
    for i in best_four_features:
        values_best_best_four_features[i] = features_dict[i]

    return values_best_best_four_features

def get_top_four_matrix(di = 3):
    imp_features = get_top_four_features(di)
    imp_features_arr = [i for i in imp_features]
    np_data = dataset[imp_features_arr].to_numpy()

    cluster_features = [i for i in imp_features]
    featured_data = dataset[cluster_features]
    kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit(data_npy)

    send_data = {}
    for i in range(0, np_data.shape[0]):
        send_data[i] = {}
        for j in range(0, len(imp_features_arr)):
            send_data[i][imp_features_arr[j]] = np_data[i][j]
        send_data[i]['label'] = int(kmeans.labels_[i])
    return send_data

def get_mds():
    embeddings = MDS(n_components=2, random_state=0)
    for_mds = std_sklr.fit_transform(data_npy)
    kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit(data_npy)
    transformed = embeddings.fit_transform(for_mds)
    # transformed = std_sklr.fit_transform(transformed)
    mds_data = []
    for i in range(transformed.shape[0]):
        mds_data.append({'dim1': transformed[i][0], 'dim2': transformed[i][1], 'label': int(kmeans.labels_[i])})

    return mds_data

def get_pcp():
    kmeans = KMeans(n_clusters=num_clusters, random_state=0).fit(dataset_total_npy)
    pcp_data = []
    for i in range(dataset_total_npy.shape[0]):
        entry = {}
        for j in range(dataset_total_npy.shape[1]):
            entry[features_total[j]] = dataset_total_npy[i][j]

        entry['label'] = int(kmeans.labels_[i])
        pcp_data.append(entry)

    for_mds_attr = np.abs(1 - dataset.corr().to_numpy())
    embeddings_corr = MDS(n_components=2, dissimilarity='precomputed',random_state=0)
    transformed2 = embeddings_corr.fit_transform(for_mds_attr)
    
    mds_attr_data = []
    for i in range(transformed2.shape[0]):
        mds_attr_data.append({'dim1': transformed2[i][0], 'dim2': transformed2[i][1], "feature": features_total[i]})

    return pcp_data, mds_attr_data
