// Serviço de API para produtos
class ApiService {
    constructor() {
        // Usar a API do repositório catalogo-products
        this.baseUrl = 'https://catalogo-products.pages.dev';
        this.imageCache = new Map();
        this.imageIndex = 0;
        
        // 500 URLs de imagens do Unsplash organizadas por categoria
        this.imageUrls = [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
];
        
        console.log('ApiService inicializado com', this.imageUrls.length, 'imagens');
    }

    // Método para obter produto por ID
    async getProductById(id) {
        try {
            // Primeiro tentar buscar na API catalogo-products
            const response = await fetch(`${this.baseUrl}/api/products/${id}`);
            if (response.ok) {
                const product = await response.json();
                return {
                    ...product,
                    image: product.image || this.getProductImage(product),
                    originalPrice: product.price?.original || (product.price?.final * 1.2),
                    discount: product.price?.discount_percent || 0,
                    stock: product.stock?.quantity || Math.floor(Math.random() * 100) + 10,
                    rating: product.rating?.average || Math.round((Math.random() * 2 + 3) * 10) / 10,
                    ratingCount: product.rating?.count || Math.floor(Math.random() * 500) + 50
                };
            }
        } catch (error) {
            console.log('Erro ao buscar produto na API catalogo-products:', error);
            
            // Fallback para FakeStore API
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (response.ok) {
                    const product = await response.json();
                    return {
                        ...product,
                        image: this.getProductImage(product),
                        originalPrice: product.price * 1.2,
                        discount: Math.floor(Math.random() * 30) + 5,
                        stock: Math.floor(Math.random() * 100) + 10,
                        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
                        ratingCount: Math.floor(Math.random() * 500) + 50
                    };
                }
            } catch (fakeStoreError) {
                console.log('Erro ao buscar produto na FakeStore API:', fakeStoreError);
            }
        }
        
        // Se não encontrar na API, buscar no database.js
        if (typeof productsDatabase !== 'undefined') {
            const allProducts = [];
            Object.values(productsDatabase).forEach(category => {
                if (Array.isArray(category)) {
                    allProducts.push(...category);
                }
            });
            const product = allProducts.find(p => p.id === id);
            if (product) {
                console.log('✅ Produto encontrado no database.js:', product);
                return product;
            }
        }
        
        console.log('❌ Produto não encontrado:', id);
        return null;
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
    
    // Método para obter produtos da API
    async getProducts(page = 1, pageSize = 20) {
        try {
            console.log(`=== CARREGANDO PRODUTOS DA API CATALOGO-PRODUCTS ===`);
            console.log(`Página: ${page}, PageSize: ${pageSize}`);
            
            const response = await fetch(`${this.baseUrl}/api/products?page=${page}&pageSize=${pageSize}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ API Response:`, data);
            
            if (data.products && Array.isArray(data.products)) {
                const products = data.products;
                console.log(`✅ ${products.length} produtos carregados da API`);
                
                // Processar produtos da API catalogo-products
                const productsWithImages = products.map(product => {
                    // A API já vem com estrutura completa, só precisamos adicionar imagens se necessário
                    const imageUrl = product.image || this.getProductImage(product);
                    
                    return {
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price?.final || product.price?.original || 0,
                        originalPrice: product.price?.original || (product.price?.final * 1.2),
                        discount: product.price?.discount_percent || 0,
                        category: product.category,
                        brand: product.brand,
                        image: imageUrl,
                        stock: product.stock?.quantity || Math.floor(Math.random() * 100) + 10,
                        rating: product.rating?.average || Math.round((Math.random() * 2 + 3) * 10) / 10,
                        ratingCount: product.rating?.count || Math.floor(Math.random() * 500) + 50
                    };
                });
                
                console.log('Primeiros 3 produtos processados:', productsWithImages.slice(0, 3));
                
                return {
                    products: productsWithImages,
                    meta: data.meta || {
                        total: productsWithImages.length,
                        page: page,
                        pageSize: pageSize
                    }
                };
            } else {
                throw new Error('Formato de resposta inválido da API');
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar produtos da API catalogo-products:', error);
            
            // Fallback para FakeStore API
            console.log('🔄 Tentando FakeStore API como fallback...');
            return this.getFakeStoreProducts(page, pageSize);
        }
    }

    // Método para obter produtos da FakeStore API (fallback)
    async getFakeStoreProducts(page = 1, limit = 20) {
        try {
            console.log(`=== CARREGANDO PRODUTOS DA FAKESTORE API ===`);
            console.log(`Página: ${page}, Limite: ${limit}`);
            
            const response = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            console.log(`✅ ${products.length} produtos carregados da FakeStore API`);
            
            // Adicionar imagens do Unsplash aos produtos
            const productsWithImages = products.map(product => {
                const imageUrl = this.getProductImage(product);
                return {
                    ...product,
                    image: imageUrl,
                    originalPrice: product.price * 1.2, // Simular preço original
                    discount: Math.floor(Math.random() * 30) + 5, // Desconto aleatório 5-35%
                    stock: Math.floor(Math.random() * 100) + 10, // Estoque aleatório 10-110
                    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating 3.0-5.0
                    ratingCount: Math.floor(Math.random() * 500) + 50 // 50-550 avaliações
                };
            });
            
            console.log('Primeiros 3 produtos processados:', productsWithImages.slice(0, 3));
            
            return {
                products: productsWithImages,
                meta: {
                    total: productsWithImages.length,
                    page: page,
                    pageSize: limit
                }
            };
            
        } catch (error) {
            console.error('❌ Erro ao carregar produtos da FakeStore API:', error);
            
            // Fallback final para produtos locais
            console.log('🔄 Usando produtos locais como fallback final...');
            return this.getLocalProducts();
        }
    }

    // Método para obter produtos locais (fallback)
    getLocalProducts() {
        console.log('=== USANDO PRODUTOS LOCAIS ===');
        
        if (typeof productsDatabase !== 'undefined') {
            const allProducts = [];
            Object.values(productsDatabase).forEach(category => {
                if (Array.isArray(category)) {
                    allProducts.push(...category);
                }
            });
            
            console.log(`✅ ${allProducts.length} produtos locais encontrados`);
            return {
                products: allProducts,
                meta: {
                    total: allProducts.length,
                    page: 1,
                    pageSize: allProducts.length
                }
            };
        }
        
        console.log('❌ Nenhum produto local encontrado');
        return {
            products: [],
            meta: { total: 0, page: 1, pageSize: 0 }
        };
    }

    // Método para obter imagem de fallback
    getFallbackImage() {
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }
}

// Criar instância global
window.apiService = new ApiService();
console.log('=== API SERVICE ATUALIZADO PARA CATALOGO-PRODUCTS ===');