from geopy.geocoders import Nominatim
import numpy as np
import pandas as pd
from sklearn.metrics import pairwise_distances
from sklearn.cluster import AgglomerativeClustering

def dhc (data): 
    cluster = input("Ingrese el numero de cluster: ")
    hc = AgglomerativeClustering(n_clusters = int(cluster), 
                    affinity = 'euclidean', 
                    linkage = 'ward')
    y_hc = hc.fit_predict(data)
    return y_hc

def matrix_distancia(data):
    dist = pairwise_distances(data)
    return dist
def geocoders (data): 
    LAT = []
    LON = []
    L2 = []
    for i in range(0,len(L1)):
        geolocator = Nominatim(user_agent="myGeolocator")
        location = geolocator.geocode(L1[i])
        print(location)
        lat = location.latitude
        lon = location.longitude
        print(lat)
        print(lon)
        LAT.append(lat)
        LON.append(lon)
    L2.append(LAT)
    L2.append(LON)
    data = pd.DataFrame(L2)
    data1 = data.transpose()
    dist = matrix_distancia(data1)
    print(dist)
    y_hc = dhc(dist)
    print(y_hc)    
L1 = ["Avenida Amazonas, Quito","Calle Moromoro, Quito","Avenida Alonso de Angulo, Quito","Avenida Mariana de Jesus, Quito","Avenida Naciones Unidas, Quito","Vicente Rocafuerte Bejarano, Guayaquil"]
geocoders(L1)

