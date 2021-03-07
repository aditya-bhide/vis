from flask import Flask, render_template, request, redirect, jsonify, url_for
import json
from calculatepca import get_data, get_top_pca, get_top_four_features, get_top_four_matrix
import pprint

app = Flask(__name__)

@app.route("/")
def index():
    raw_data = get_data()
    data_json = json.dumps(raw_data, indent=2)
    data = {'chart_data':data_json}
    return render_template("index.html", data=data)

@app.route("/screeplot", methods=["POST", "GET"])
def id_index():
    if request.method == "POST":
        print("SHit is happening")
        raw_data = get_data()
        # data_json = json.dumps(raw_data, indent=2)
        data = {'chart_data':raw_data}
        return data
    else:
        print("I fucked up")

@app.route("/id_index", methods=["POST", "GET"])
def screeplot():
    if request.method == "POST":
        print("SHit is happening")
        data_back = request.form['data']
        four_features = get_top_four_features(int(data_back))
        chart_data = get_top_four_matrix(int(data_back))
        pprint.pprint(chart_data)
        data = {'feature_data':four_features, 'chart_data': chart_data}
        return data
    else:
        print("I fucked up")

@app.route("/biplot", methods=["POST", "GET"])
def call_biplot():
    if request.method == "POST":
        print("SHit is happening")
        feature_contri, plot_pca = get_top_pca()
        data = {'feature_contri' : feature_contri,'plot_pca' :plot_pca }
        return data
    else:
        print("I fucked up")

    

if __name__ == "__main__":
    app.run(debug=True)
