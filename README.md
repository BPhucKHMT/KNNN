# KNNN - K-Nearest Neighbors Algorithm Implementation

## Tổng quan

KNNN là một dự án triển khai thuật toán K-Nearest Neighbors (KNN), một trong những thuật toán học máy cơ bản và hiệu quả nhất cho các bài toán phân loại và hồi quy. Thuật toán này hoạt động dựa trên nguyên lý đơn giản: để dự đoán nhãn của một điểm dữ liệu mới, ta tìm k điểm dữ liệu gần nhất trong tập dữ liệu huấn luyện và đưa ra dự đoán dựa trên nhãn của những điểm này.

## Tính năng

- ✅ Thuật toán KNN cơ bản cho phân loại và hồi quy
- ✅ Hỗ trợ nhiều phương pháp tính khoảng cách (Euclidean, Manhattan, Minkowski)
- ✅ Xử lý dữ liệu nhiều chiều
- ✅ Tối ưu hóa hiệu suất với các cấu trúc dữ liệu hiệu quả
- ✅ API đơn giản và dễ sử dụng
- ✅ Hỗ trợ cả Python và các ngôn ngữ khác

## Cài đặt

### Yêu cầu hệ thống

- Python 3.7 trở lên
- NumPy
- Scikit-learn (tùy chọn, cho so sánh)
- Matplotlib (cho visualization)

### Cài đặt từ source

```bash
# Clone repository
git clone https://github.com/BPhucKHMT/KNNN.git
cd KNNN

# Cài đặt dependencies
pip install -r requirements.txt

# Hoặc sử dụng conda
conda install numpy matplotlib scikit-learn
```

### Cài đặt qua pip (nếu có)

```bash
pip install knnn
```

## Cách sử dụng cơ bản

### 1. Import thư viện

```python
from knnn import KNNClassifier, KNNRegressor
import numpy as np
from sklearn.datasets import make_classification, make_regression
from sklearn.model_selection import train_test_split
```

### 2. Sử dụng cho bài toán phân loại

```python
# Tạo dữ liệu mẫu
X, y = make_classification(n_samples=1000, n_features=4, n_redundant=0, 
                          n_informative=2, random_state=42)

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, 
                                                    random_state=42)

# Khởi tạo model
knn_classifier = KNNClassifier(k=5, distance_metric='euclidean')

# Huấn luyện model
knn_classifier.fit(X_train, y_train)

# Dự đoán
predictions = knn_classifier.predict(X_test)

# Đánh giá độ chính xác
accuracy = knn_classifier.score(X_test, y_test)
print(f"Accuracy: {accuracy:.4f}")
```

### 3. Sử dụng cho bài toán hồi quy

```python
# Tạo dữ liệu hồi quy
X, y = make_regression(n_samples=1000, n_features=4, noise=0.1, 
                       random_state=42)

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, 
                                                    random_state=42)

# Khởi tạo model
knn_regressor = KNNRegressor(k=5, distance_metric='euclidean')

# Huấn luyện và dự đoán
knn_regressor.fit(X_train, y_train)
predictions = knn_regressor.predict(X_test)

# Đánh giá Mean Squared Error
mse = knn_regressor.mean_squared_error(X_test, y_test)
print(f"Mean Squared Error: {mse:.4f}")
```

## Các tham số cấu hình

### KNNClassifier / KNNRegressor

| Tham số | Mô tả | Giá trị mặc định | Các tùy chọn |
|---------|-------|------------------|---------------|
| `k` | Số lượng láng giềng gần nhất | 5 | int > 0 |
| `distance_metric` | Phương pháp tính khoảng cách | 'euclidean' | 'euclidean', 'manhattan', 'minkowski' |
| `weights` | Cách tính trọng số | 'uniform' | 'uniform', 'distance' |
| `p` | Tham số cho Minkowski distance | 2 | int ≥ 1 |

### Ví dụ cấu hình nâng cao

```python
# KNN với weighted voting
knn = KNNClassifier(k=7, distance_metric='minkowski', p=3, weights='distance')

# KNN với Manhattan distance
knn_manhattan = KNNClassifier(k=3, distance_metric='manhattan')
```

## Ví dụ thực tế

### Phân loại hoa Iris

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from knnn import KNNClassifier

# Load dữ liệu Iris
iris = load_iris()
X, y = iris.data, iris.target

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, 
                                                    random_state=42)

# Thử nghiệm với các giá trị k khác nhau
k_values = [1, 3, 5, 7, 9]
accuracies = []

for k in k_values:
    knn = KNNClassifier(k=k)
    knn.fit(X_train, y_train)
    accuracy = knn.score(X_test, y_test)
    accuracies.append(accuracy)
    print(f"k={k}: Accuracy = {accuracy:.4f}")

# Tìm k tốt nhất
best_k = k_values[np.argmax(accuracies)]
print(f"Best k: {best_k}")
```

### Dự đoán giá nhà

```python
from sklearn.datasets import fetch_california_housing
from sklearn.preprocessing import StandardScaler
from knnn import KNNRegressor

# Load dữ liệu
housing = fetch_california_housing()
X, y = housing.data, housing.target

# Chuẩn hóa dữ liệu
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, 
                                                    test_size=0.2, 
                                                    random_state=42)

# Huấn luyện model
knn_reg = KNNRegressor(k=10, weights='distance')
knn_reg.fit(X_train, y_train)

# Dự đoán và đánh giá
predictions = knn_reg.predict(X_test)
mse = knn_reg.mean_squared_error(X_test, y_test)
print(f"Mean Squared Error: {mse:.4f}")
```

## Tối ưu hóa hiệu suất

### 1. Chọn k phù hợp

```python
from sklearn.model_selection import cross_val_score

# Grid search cho k tốt nhất
k_range = range(1, 31)
cv_scores = []

for k in k_range:
    knn = KNNClassifier(k=k)
    scores = cross_val_score(knn, X_train, y_train, cv=10, scoring='accuracy')
    cv_scores.append(scores.mean())

# Vẽ biểu đồ
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 6))
plt.plot(k_range, cv_scores)
plt.xlabel('Value of k')
plt.ylabel('Cross-Validation Accuracy')
plt.title('Optimal k for KNN')
plt.show()

optimal_k = k_range[np.argmax(cv_scores)]
print(f"Optimal k: {optimal_k}")
```

### 2. Tiền xử lý dữ liệu

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Chuẩn hóa dữ liệu (quan trọng cho KNN)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Hoặc sử dụng Min-Max scaling
min_max_scaler = MinMaxScaler()
X_train_minmax = min_max_scaler.fit_transform(X_train)
X_test_minmax = min_max_scaler.transform(X_test)
```

## Benchmark và So sánh

```python
import time
from sklearn.neighbors import KNeighborsClassifier

# So sánh với Scikit-learn
def benchmark_models(X_train, X_test, y_train, y_test):
    # KNNN implementation
    start_time = time.time()
    knn_custom = KNNClassifier(k=5)
    knn_custom.fit(X_train, y_train)
    custom_predictions = knn_custom.predict(X_test)
    custom_time = time.time() - start_time
    custom_accuracy = knn_custom.score(X_test, y_test)
    
    # Scikit-learn implementation
    start_time = time.time()
    knn_sklearn = KNeighborsClassifier(n_neighbors=5)
    knn_sklearn.fit(X_train, y_train)
    sklearn_predictions = knn_sklearn.predict(X_test)
    sklearn_time = time.time() - start_time
    sklearn_accuracy = knn_sklearn.score(X_test, y_test)
    
    print("Benchmark Results:")
    print(f"Custom KNNN - Time: {custom_time:.4f}s, Accuracy: {custom_accuracy:.4f}")
    print(f"Scikit-learn - Time: {sklearn_time:.4f}s, Accuracy: {sklearn_accuracy:.4f}")

benchmark_models(X_train, X_test, y_train, y_test)
```

## API Reference

### KNNClassifier

#### Methods

- `fit(X, y)`: Huấn luyện model với dữ liệu training
- `predict(X)`: Dự đoán nhãn cho dữ liệu mới
- `predict_proba(X)`: Trả về xác suất dự đoán cho mỗi class
- `score(X, y)`: Tính accuracy trên test set
- `get_neighbors(X, k=None)`: Trả về k láng giềng gần nhất

#### Parameters

- `k` (int): Số láng giềng gần nhất
- `distance_metric` (str): Phương pháp tính khoảng cách
- `weights` (str): Cách tính trọng số ('uniform' hoặc 'distance')
- `p` (int): Tham số cho Minkowski distance

### KNNRegressor

#### Methods

- `fit(X, y)`: Huấn luyện model với dữ liệu training
- `predict(X)`: Dự đoán giá trị cho dữ liệu mới
- `score(X, y)`: Tính R² score trên test set
- `mean_squared_error(X, y)`: Tính Mean Squared Error

## Xử lý lỗi thường gặp

### 1. Dữ liệu không được chuẩn hóa

```python
# ❌ Sai
knn = KNNClassifier(k=5)
knn.fit(X_train, y_train)  # X_train chưa được scale

# ✅ Đúng
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
knn = KNNClassifier(k=5)
knn.fit(X_train_scaled, y_train)
```

### 2. Chọn k không phù hợp

```python
# ❌ k quá lớn hoặc quá nhỏ
knn = KNNClassifier(k=1)  # Overfitting
knn = KNNClassifier(k=len(X_train))  # Underfitting

# ✅ Sử dụng cross-validation để chọn k
from sklearn.model_selection import GridSearchCV
param_grid = {'k': range(1, 21)}
grid_search = GridSearchCV(KNNClassifier(), param_grid, cv=5)
grid_search.fit(X_train, y_train)
best_k = grid_search.best_params_['k']
```

### 3. Xử lý dữ liệu thiếu

```python
from sklearn.impute import SimpleImputer

# Xử lý missing values
imputer = SimpleImputer(strategy='mean')
X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)
```

## Contributing

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình đóng góp.

### Cách đóng góp

1. Fork repository này
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Coding Standards

- Sử dụng PEP 8 cho Python code
- Viết docstrings cho tất cả public methods
- Thêm unit tests cho features mới
- Đảm bảo code coverage > 90%

## Testing

```bash
# Chạy all tests
python -m pytest tests/

# Chạy với coverage
python -m pytest tests/ --cov=knnn --cov-report=html

# Chạy specific test file
python -m pytest tests/test_classifier.py -v
```

## Roadmap

- [ ] Hỗ trợ GPU acceleration với CUDA
- [ ] Implement approximate nearest neighbors (ANN)
- [ ] Thêm support cho sparse matrices
- [ ] Web interface cho demo
- [ ] R package binding
- [ ] Distributed computing support

## Performance Tips

1. **Chuẩn hóa dữ liệu**: Luôn scale features trước khi sử dụng KNN
2. **Chọn k phù hợp**: Sử dụng cross-validation để tìm k tốt nhất
3. **Feature selection**: Loại bỏ features không quan trọng
4. **Dimensionality reduction**: Sử dụng PCA cho dữ liệu high-dimensional
5. **Memory optimization**: Sử dụng efficient data structures

## License

Dự án này được cấp phép theo [MIT License](LICENSE) - xem file LICENSE để biết chi tiết.

## Tác giả

- **BPhucKHMT** - *Initial work* - [BPhucKHMT](https://github.com/BPhucKHMT)

## Acknowledgments

- Cảm ơn scikit-learn team vì inspiration
- Cảm ơn cộng đồng open source
- Các tài liệu tham khảo về KNN algorithm

## Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

- Mở [GitHub Issue](https://github.com/BPhucKHMT/KNNN/issues)
- Email: [your-email@example.com]
- Join Discord: [Discord link]

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Basic KNN classifier and regressor
- Support for multiple distance metrics
- Complete documentation

---

**⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star trên GitHub!**