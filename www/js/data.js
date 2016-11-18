var serverUrl = 'https://jstalks2016.azurewebsites.net/';

var data = {};

data.initializeClient = function () {
    data.client = new WindowsAzure.MobileServiceClient(serverUrl);
};


data.getBoxes = function() {
    return data.client.getTable('Box')
        .orderBy('name')
        .read();
};

data.getBoxById = function (boxId) {
    return data.client.getTable('Box')
        .lookup(boxId);
};

data.saveBox = function(box) {
    var table = data.client.getTable('Box');

    if (box.id) {
        return table.update(box);
    } else {
        return table.insert(box);
    }
};

data.deleteBoxById = function(boxId) {
    return data.client.getTable('Box')
        .del({ id: boxId });
};


data.getItemsByBoxId = function(boxId) {
    return data.client.getTable('Item')
        .where({ boxId: boxId })
        .orderBy('name')
        .read();
};

data.getItemById = function (itemId) {
    return data.client.getTable('Item')
        .lookup(itemId);
};

data.saveItem = function(item) {
    var table = data.client.getTable('Item');

    if (item.id) {
        return table.update(item);
    } else {
        return table.insert(item);
    }
};

data.deleteItemById = function(itemId) {
    return data.client.getTable('Item')
        .del({ id: itemId });
};