import numpy
import sklearn.decomposition
 
dim=2
data=numpy.loadtxt("data.csv", delimiter=",")
pca=sklearn.decomposition.PCA(dim)
 
result=pca.fit_transform(data);
numpy.savetxt("result.csv", result, delimiter=",")
