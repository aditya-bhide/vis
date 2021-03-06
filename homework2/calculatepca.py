from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np
import math
import pandas as pd
import pprint


breast = load_breast_cancer()
features = breast.feature_names
breast_data = breast.data

dataset = pd.DataFrame(breast_data)
dataset.columns = features

std_sklr = StandardScaler()
x = std_sklr.fit_transform(X = breast_data)
pca_breast = PCA(n_components=10)
principalComponents_breast = pca_breast.fit_transform(x)
eigen_values = pca_breast.explained_variance_

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
    data_send = {}
    count = 0
    for i, j, k in zip(features, pca_breast.components_[0], pca_breast.components_[1]):
        data_send[count] = {}
        data_send[count]["name"] = i
        data_send[count]["pc1"] = j
        data_send[count]["pc2"] = k
        count += 1
    return data_send

def get_top_four_features(di = 3):
    squared_value = pca_breast.components_[:di] ** 2

    features_dict = {}
    for i in range(0, len(squared_value[0])):
        total = 0
        for j in range(0, len(squared_value)):
            total += squared_value[j][i]
        features_dict[features[i]] = math.sqrt(total)

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
    send_data = {}
    for i in range(0, np_data.shape[0]):
        send_data[i] = {}
        for j in range(0, len(imp_features_arr)):
            send_data[i][imp_features_arr[j]] = np_data[i][j]
    
    return send_data