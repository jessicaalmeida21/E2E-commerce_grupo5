// Módulo para clonagem de produtos com imagens
const productCloneModule = (() => {
    let currentProduct = null;
    let cloneOptions = {
        newTitle: '',
        mainImage: '',
        additionalImages: [],
        keepOriginalImages: false
    };

    // Inicializar módulo
    function init() {
        console.log('Módulo de clonagem de produtos inicializado');
    }

    // Mostrar modal de clonagem
    function showCloneModal(product) {
        currentProduct = product;
        cloneOptions = {
            newTitle: `${product.title} (Cópia)`,
            mainImage: product.image,
            additionalImages: [],
            keepOriginalImages: false
        };
        
        createCloneModal();
        document.getElementById('cloneModal').style.display = 'block';
    }

    // Criar modal de clonagem
    function createCloneModal() {
        const modalHTML = `
            <div id="cloneModal" class="clone-modal" style="display: none;">
                <div class="clone-modal-content">
                    <div class="clone-modal-header">
                        <h2>Clonar Produto com Imagens</h2>
                        <span class="close" onclick="closeCloneModal()">&times;</span>
                    </div>
                    
                    <div class="clone-modal-body">
                        <div class="product-preview">
                            <h3>Produto Original</h3>
                            <div class="original-product">
                                <img src="${currentProduct.image}" alt="${currentProduct.title}" class="product-image">
                                <div class="product-info">
                                    <h4>${currentProduct.title}</h4>
                                    <p>Marca: ${currentProduct.brand}</p>
                                    <p>Preço: R$ ${currentProduct.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div class="clone-options">
                            <h3>Opções de Clonagem</h3>
                            
                            <div class="form-group">
                                <label for="newTitle">Novo Título:</label>
                                <input type="text" id="newTitle" value="${cloneOptions.newTitle}" 
                                       placeholder="Digite o novo título">
                            </div>

                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="keepOriginalImages" 
                                           ${cloneOptions.keepOriginalImages ? 'checked' : ''}>
                                    Manter imagens originais
                                </label>
                            </div>

                            <div class="form-group" id="imageOptions" style="display: ${cloneOptions.keepOriginalImages ? 'none' : 'block'};">
                                <label>Imagem Principal:</label>
                                <div class="image-selector">
                                    <img id="mainImagePreview" src="${cloneOptions.mainImage}" alt="Preview" class="image-preview">
                                    <button type="button" onclick="generateNewMainImage()">Gerar Nova Imagem</button>
                                </div>
                            </div>

                            <div class="form-group" id="additionalImagesGroup" style="display: ${cloneOptions.keepOriginalImages ? 'none' : 'block'};">
                                <label>Imagens Adicionais:</label>
                                <div id="additionalImagesList" class="additional-images">
                                    <!-- Imagens adicionais serão inseridas aqui -->
                                </div>
                                <button type="button" onclick="addAdditionalImage()">Adicionar Imagem</button>
                            </div>
                        </div>
                    </div>

                    <div class="clone-modal-footer">
                        <button type="button" onclick="closeCloneModal()" class="btn-cancel">Cancelar</button>
                        <button type="button" onclick="executeClone()" class="btn-clone">Clonar Produto</button>
                    </div>
                </div>
            </div>
        `;

        // Remover modal existente se houver
        const existingModal = document.getElementById('cloneModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Adicionar modal ao DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Adicionar estilos CSS
        addCloneModalStyles();
        
        // Carregar imagens adicionais se existirem
        loadAdditionalImages();
    }

    // Adicionar estilos CSS para o modal
    function addCloneModalStyles() {
        const styles = `
            <style>
                .clone-modal {
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                }

                .clone-modal-content {
                    background-color: #fefefe;
                    margin: 5% auto;
                    padding: 0;
                    border: none;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }

                .clone-modal-header {
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .clone-modal-header h2 {
                    margin: 0;
                    font-size: 1.5em;
                }

                .close {
                    color: white;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: opacity 0.3s;
                }

                .close:hover {
                    opacity: 0.7;
                }

                .clone-modal-body {
                    padding: 20px;
                }

                .product-preview {
                    margin-bottom: 30px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .original-product {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .product-image {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .product-info h4 {
                    margin: 0 0 5px 0;
                    color: #333;
                }

                .product-info p {
                    margin: 2px 0;
                    color: #666;
                    font-size: 0.9em;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #333;
                }

                .form-group input[type="text"] {
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                }

                .form-group input[type="text"]:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .image-selector {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .image-preview {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 5px;
                    border: 2px solid #ddd;
                }

                .additional-images {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .additional-image-item {
                    position: relative;
                    display: inline-block;
                }

                .additional-image-item img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 5px;
                    border: 2px solid #ddd;
                }

                .remove-image {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4757;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .clone-modal-footer {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 0 0 10px 10px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .btn-cancel, .btn-clone {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s;
                }

                .btn-cancel {
                    background: #6c757d;
                    color: white;
                }

                .btn-cancel:hover {
                    background: #5a6268;
                }

                .btn-clone {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-clone:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                button {
                    padding: 8px 16px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background 0.3s;
                }

                button:hover {
                    background: #5a6fd8;
                }
            </style>
        `;

        // Adicionar estilos se não existirem
        if (!document.getElementById('cloneModalStyles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'cloneModalStyles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    // Carregar imagens adicionais
    function loadAdditionalImages() {
        const container = document.getElementById('additionalImagesList');
        container.innerHTML = '';

        cloneOptions.additionalImages.forEach((imageUrl, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'additional-image-item';
            imageItem.innerHTML = `
                <img src="${imageUrl}" alt="Imagem adicional ${index + 1}">
                <button class="remove-image" onclick="removeAdditionalImage(${index})">&times;</button>
            `;
            container.appendChild(imageItem);
        });
    }

    // Adicionar imagem adicional
    function addAdditionalImage() {
        if (!cloneOptions.keepOriginalImages) {
            const newImage = apiService.getProductImage(currentProduct);
            cloneOptions.additionalImages.push(newImage);
            loadAdditionalImages();
        }
    }

    // Remover imagem adicional
    function removeAdditionalImage(index) {
        cloneOptions.additionalImages.splice(index, 1);
        loadAdditionalImages();
    }

    // Gerar nova imagem principal
    function generateNewMainImage() {
        if (!cloneOptions.keepOriginalImages) {
            const newImage = apiService.getProductImage(currentProduct);
            cloneOptions.mainImage = newImage;
            document.getElementById('mainImagePreview').src = newImage;
        }
    }

    // Executar clonagem
    async function executeClone() {
        try {
            // Atualizar opções com valores do formulário
            cloneOptions.newTitle = document.getElementById('newTitle').value;
            cloneOptions.keepOriginalImages = document.getElementById('keepOriginalImages').checked;

            let clonedProduct;

            if (cloneOptions.keepOriginalImages) {
                // Clonar mantendo imagens originais
                clonedProduct = await apiService.cloneProductKeepImages(currentProduct.id);
            } else {
                // Clonar com novas imagens
                clonedProduct = await apiService.cloneProductWithImages(currentProduct.id, cloneOptions);
            }

            // Atualizar título se foi modificado
            if (cloneOptions.newTitle !== `${currentProduct.title} (Cópia)`) {
                clonedProduct.title = cloneOptions.newTitle;
            }

            console.log('Produto clonado com sucesso:', clonedProduct);
            
            // Mostrar notificação de sucesso
            showNotification('Produto clonado com sucesso!', 'success');
            
            // Fechar modal
            closeCloneModal();
            
            // Atualizar lista de produtos se estiver em uma página de produtos
            if (typeof productsModule !== 'undefined' && productsModule.refreshProducts) {
                productsModule.refreshProducts();
            }

            return clonedProduct;

        } catch (error) {
            console.error('Erro ao clonar produto:', error);
            showNotification('Erro ao clonar produto: ' + error.message, 'error');
        }
    }

    // Fechar modal
    function closeCloneModal() {
        const modal = document.getElementById('cloneModal');
        if (modal) {
            modal.style.display = 'none';
        }
        currentProduct = null;
    }

    // Mostrar notificação
    function showNotification(message, type = 'info') {
        // Usar sistema de notificação existente se disponível
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback simples
            alert(message);
        }
    }

    // Adicionar botão de clonagem ao card do produto
    function addCloneButtonToProductCard(card, product) {
        const actionsContainer = card.querySelector('.product-actions');
        if (actionsContainer) {
            const cloneButton = document.createElement('button');
            cloneButton.className = 'clone-btn';
            cloneButton.innerHTML = '<i class="fas fa-copy"></i> Clonar';
            cloneButton.onclick = () => showCloneModal(product);
            
            actionsContainer.appendChild(cloneButton);
        }
    }

    // API pública
    return {
        init,
        showCloneModal,
        closeCloneModal,
        executeClone,
        addCloneButtonToProductCard,
        addAdditionalImage,
        removeAdditionalImage,
        generateNewMainImage
    };
})();

// Funções globais para uso no HTML
window.showCloneModal = (product) => productCloneModule.showCloneModal(product);
window.closeCloneModal = () => productCloneModule.closeCloneModal();
window.executeClone = () => productCloneModule.executeClone();
window.addAdditionalImage = () => productCloneModule.addAdditionalImage();
window.removeAdditionalImage = (index) => productCloneModule.removeAdditionalImage(index);
window.generateNewMainImage = () => productCloneModule.generateNewMainImage();

// Inicializar módulo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    productCloneModule.init();
});

// Exportar para uso em outros módulos
window.productCloneModule = productCloneModule;
