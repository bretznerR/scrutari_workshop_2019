function SCRUTARI_FRAMEWORKINIT (scrutariClient) {
    
    scrutariClient._modalFunction = function ($modal, action) {
        $modal.modal(action);
    };
    
}
