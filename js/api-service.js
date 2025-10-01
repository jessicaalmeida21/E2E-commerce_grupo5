// Serviço de API para produtos
class ApiService {
    constructor() {
        this.baseUrl = 'https://fakestoreapi.com';
        this.imageCache = new Map();
        this.imageIndex = 0;
        
        // 500 URLs de imagens do Unsplash organizadas por categoria
        this.imageUrls = [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
];
        
        console.log('ApiService inicializado com', this.imageUrls.length, 'imagens');
    }

    // Método para obter todos os produtos com paginação
    async getProducts(page = 1, pageSize = 500) {
        try {
            console.log('=== CARREGANDO PRODUTOS ===');
            console.log('Página:', page, 'Tamanho:', pageSize);
            
            // Carregar do database.js local
            if (typeof productsDatabase !== 'undefined') {
                console.log('✓ Database.js encontrado, carregando produtos locais...');
                const allProducts = [];
                
                Object.values(productsDatabase).forEach(category => {
                    if (Array.isArray(category)) {
                        allProducts.push(...category);
                    }
                });
                
                console.log('✓ Total de produtos no database.js:', allProducts.length);
                
                // Aplicar paginação
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedProducts = allProducts.slice(startIndex, endIndex);
                
                console.log('✓ Produtos retornados (página', page + '):', paginatedProducts.length);
                
                return {
                    products: paginatedProducts,
                    total: allProducts.length,
                    page: page,
                    pageSize: pageSize,
                    totalPages: Math.ceil(allProducts.length / pageSize)
                };
            }
            
            // Se database.js não estiver disponível, usar produtos de fallback
            console.log('⚠️ Database.js não encontrado, usando produtos de fallback...');
            const fallbackProducts = [
                {
                    id: 1,
                    title: 'Produto de Exemplo',
                    price: 99.99,
                    category: 'eletrônicos',
                    description: 'Produto de exemplo para demonstração',
                    image: this.getFallbackImage(),
                    stock: 10,
                    active: true
                }
            ];
            
            return {
                products: fallbackProducts,
                total: fallbackProducts.length,
                page: page,
                pageSize: pageSize,
                totalPages: 1
            };
            
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            
            // Fallback: retornar array vazio
            console.log('❌ Retornando array vazio devido ao erro');
            return {
                products: [],
                total: 0,
                page: page,
                pageSize: pageSize,
                totalPages: 0
            };
        }
    }

    // Método para obter produto por ID
    async getProductById(id) {
        try {
            console.log('🔍 Buscando produto por ID:', id);
            
            // Buscar no database.js local
            if (typeof productsDatabase !== 'undefined') {
                console.log('✓ Database.js encontrado, buscando produto...');
                const allProducts = [];
                
                Object.values(productsDatabase).forEach(category => {
                    if (Array.isArray(category)) {
                        allProducts.push(...category);
                    }
                });
                
                const product = allProducts.find(p => p.id === parseInt(id));
                if (product) {
                    console.log('✅ Produto encontrado no database.js:', product);
                    return product;
                }
            }
            
            console.log('❌ Produto não encontrado:', id);
            return null;
            
        } catch (error) {
            console.error('❌ Erro ao buscar produto:', error);
            return null;
        }
    }

    // Método para obter imagem do produto com sistema de 500 imagens
    getProductImage(product) {
        if (!product) return this.getFallbackImage();
        
        // Se o produto já tem imagem, usar ela
        if (product.image && product.image !== '') {
            console.log('✓ Usando imagem existente do produto');
            return product.image;
        }
        
        const title = product.title?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        
        console.log('=== GERANDO IMAGEM REAL ===');
        console.log('Título:', title);
        console.log('Marca:', brand);
        console.log('Categoria:', category);
        
        // Sistema inteligente de seleção de imagens
        let selectedImage = null;
        
        // Smartphones
        if (title.includes('smartphone') || title.includes('iphone') || title.includes('galaxy') || title.includes('xiaomi') || title.includes('phone')) {
            selectedImage = this.getImageByCategory('smartphone');
        }
        // Notebooks/Laptops
        else if (title.includes('notebook') || title.includes('laptop') || title.includes('macbook') || title.includes('pc')) {
            selectedImage = this.getImageByCategory('notebook');
        }
        // TVs
        else if (title.includes('smart tv') || title.includes('tv') || title.includes('televisão') || title.includes('television')) {
            selectedImage = this.getImageByCategory('tv');
        }
        // Fones de ouvido
        else if (title.includes('fone') || title.includes('headphone') || title.includes('headset') || title.includes('bluetooth')) {
            selectedImage = this.getImageByCategory('headphone');
        }
        // Tênis/Calçados
        else if (title.includes('tênis') || title.includes('sneaker') || title.includes('shoe') || title.includes('nike') || title.includes('adidas')) {
            selectedImage = this.getImageByCategory('shoe');
        }
        // Roupas
        else if (title.includes('camiseta') || title.includes('shirt') || title.includes('dress') || title.includes('clothing')) {
            selectedImage = this.getImageByCategory('clothing');
        }
        // Eletrodomésticos
        else if (title.includes('liquidificador') || title.includes('blender') || title.includes('air fryer') || title.includes('aspirador')) {
            selectedImage = this.getImageByCategory('appliance');
        }
        // Esportes
        else if (title.includes('bicicleta') || title.includes('bike') || title.includes('skate') || title.includes('halteres')) {
            selectedImage = this.getImageByCategory('sports');
        }
        // Joias
        else if (title.includes('anel') || title.includes('ring') || title.includes('colar') || title.includes('necklace')) {
            selectedImage = this.getImageByCategory('jewelry');
        }
        // Monitores
        else if (title.includes('monitor') || title.includes('display') || title.includes('screen')) {
            selectedImage = this.getImageByCategory('monitor');
        }
        // Relógios
        else if (title.includes('relógio') || title.includes('watch') || title.includes('smartwatch')) {
            selectedImage = this.getImageByCategory('watch');
        }
        // Fallback genérico
        else {
            selectedImage = this.getRandomImage();
        }
        
        console.log('✓ Imagem selecionada:', selectedImage);
        return selectedImage;
    }
    
    // Método para obter imagem por categoria
    getImageByCategory(category) {
        const categoryImages = {
            smartphone: [0, 1, 2], // índices das imagens de smartphone
            notebook: [3, 4, 5],   // índices das imagens de notebook
            tv: [6, 7, 8],         // índices das imagens de TV
            headphone: [9, 10, 11], // índices das imagens de fone
            shoe: [12, 13, 14],    // índices das imagens de tênis
            clothing: [15, 16, 17], // índices das imagens de roupas
            appliance: [18, 19, 20], // índices das imagens de eletrodomésticos
            sports: [21, 22, 23],  // índices das imagens de esportes
            jewelry: [24, 25, 26], // índices das imagens de joias
            monitor: [27, 28, 29], // índices das imagens de monitor
            watch: [30, 31, 32]    // índices das imagens de relógio
        };
        
        if (categoryImages[category]) {
            const randomIndex = categoryImages[category][Math.floor(Math.random() * categoryImages[category].length)];
            return this.imageUrls[randomIndex] || this.getRandomImage();
        }
        
        return this.getRandomImage();
    }
    
    // Método para obter imagem aleatória
    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.imageUrls.length);
        return this.imageUrls[randomIndex];
    }
    
    // Método para obter imagem de fallback
    getFallbackImage() {
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }
    
    // Método para obter categorias
    async getCategories() {
        try {
            console.log('🔍 Carregando categorias via API Service...');
            
            // Tentar carregar do database.js primeiro
            if (typeof window !== 'undefined' && typeof window.getCategories === 'function') {
                const categories = window.getCategories();
                console.log('✅ Categorias carregadas do database.js:', categories);
                return categories.map(cat => cat.name || cat.key || cat);
            }
            
            // Se getCategories não estiver disponível, tentar acessar diretamente o productsDatabase
            if (typeof productsDatabase !== 'undefined') {
                const categoryKeys = Object.keys(productsDatabase);
                const categories = categoryKeys.map(key => {
                    const displayNames = {
                        'smartphones': 'Smartphones',
                        'notebooks': 'Notebooks',
                        'televisoes': 'Televisões',
                        'audio': 'Áudio e Som',
                        'calcados': 'Calçados',
                        'roupas': 'Roupas',
                        'eletrodomesticos': 'Eletrodomésticos',
                        'esportes': 'Esportes e Lazer',
                        'monitores': 'Monitores',
                        'relogios': 'Relógios'
                    };
                    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
                });
                console.log('✅ Categorias extraídas do productsDatabase:', categories);
                return categories;
            }
            
            // Fallback para categorias padrão
            const defaultCategories = [
                'Smartphones', 'Notebooks', 'Televisões', 'Áudio e Som', 
                'Calçados', 'Roupas', 'Eletrodomésticos', 'Esportes e Lazer', 
                'Monitores', 'Relógios'
            ];
            
            console.log('⚠️ Usando categorias padrão:', defaultCategories);
            return defaultCategories;
            
        } catch (error) {
            console.error('❌ Erro ao carregar categorias:', error);
            return ['Smartphones', 'Notebooks', 'Televisões', 'Áudio e Som', 'Calçados', 'Roupas', 'Eletrodomésticos', 'Esportes e Lazer', 'Monitores', 'Relógios'];
        }
    }
}

// Criar instância global
window.apiService = new ApiService();
console.log('=== API SERVICE COM 500 IMAGENS CARREGADO ===');