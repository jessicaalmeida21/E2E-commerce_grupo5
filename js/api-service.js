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
        
        console.log('=== GERANDO IMAGEM ESPECÍFICA ===');
        console.log('Título:', title);
        console.log('Marca:', brand);
        console.log('Categoria:', category);
        
        // Sistema específico de seleção de imagens baseado no nome exato
        let selectedImage = null;
        
        // Aspirador Robô - Imagem específica de aspirador robô
        if (title.includes('aspirador') && title.includes('robô')) {
            selectedImage = 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Liquidificador - Imagem específica de liquidificador
        else if (title.includes('liquidificador')) {
            selectedImage = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Air Fryer - Imagem específica de air fryer
        else if (title.includes('air fryer') || title.includes('fritadeira')) {
            selectedImage = 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Smartphones específicos
        else if (title.includes('iphone')) {
            selectedImage = 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('galaxy') || title.includes('samsung')) {
            selectedImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('xiaomi') || title.includes('redmi')) {
            selectedImage = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Notebooks específicos
        else if (title.includes('notebook') || title.includes('laptop')) {
            if (title.includes('dell')) {
                selectedImage = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('lenovo')) {
                selectedImage = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                selectedImage = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        // TVs específicas
        else if (title.includes('tv') || title.includes('televisão')) {
            selectedImage = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Fones específicos
        else if (title.includes('fone') || title.includes('headphone')) {
            if (title.includes('sony')) {
                selectedImage = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('jbl')) {
                selectedImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                selectedImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        // Tênis específicos
        else if (title.includes('tênis') || title.includes('sneaker')) {
            if (title.includes('nike')) {
                selectedImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('adidas')) {
                selectedImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                selectedImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        // Roupas específicas
        else if (title.includes('camiseta') || title.includes('shirt')) {
            selectedImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('calça') || title.includes('jeans')) {
            selectedImage = 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('jaqueta') || title.includes('jacket')) {
            selectedImage = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Esportes específicos
        else if (title.includes('bicicleta') || title.includes('bike')) {
            selectedImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('skate')) {
            selectedImage = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('halteres') || title.includes('peso')) {
            selectedImage = 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('bola') && title.includes('futebol')) {
            selectedImage = 'https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Monitores
        else if (title.includes('monitor')) {
            selectedImage = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Relógios
        else if (title.includes('relógio') || title.includes('watch')) {
            selectedImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Joias específicas
        else if (title.includes('anel') || title.includes('ring')) {
            selectedImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('colar') || title.includes('necklace')) {
            selectedImage = 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        else if (title.includes('brinco') || title.includes('earring')) {
            selectedImage = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        // Fallback baseado na categoria
        else {
            selectedImage = this.getImageByCategory(category);
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