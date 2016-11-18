var app = {};

app.isDeviceReady = false;
app.isDocumentReady = false;

/** AUTHENTICATION **/

app.login = function(provider) {
    switch (provider) {
        case 'facebook':
            app.showAlert('facebook');
            break;
        case 'twitter':
            app.showAlert('twitter');
            break;
        default:
            app.showAlert('Unknown provider. Please try again.');
            break;
    }
};

/** BOX **/

app.showListOfBoxes = function() {
    app.switchToPage('pageBoxes');
    app.showModalMessage('Getting list of boxes from server...');

    var list = $('#listBoxes');
    list.empty();

    var promises = [];
    promises.push(data.getBoxes());

    Promise.all(promises).then(function(results){
        var boxes = results[0];

        for(var i = 0; i < boxes.length; i++) {
            var box = boxes[i];

            var boxHtml = [];
            boxHtml.push('<div class="col-xs-7">' + box.name + '</div>');
            boxHtml.push('<div class="col-xs-2">' + box.itemsCount + '</div>');
            boxHtml.push('<div class="col-xs-1"><a href="#" class="glyphicon glyphicon-list" onclick="app.showListOfItems(\'' + box.id + '\')"></a></div>');
            boxHtml.push('<div class="col-xs-1"><a href="#" class="glyphicon glyphicon-pencil" onclick="app.showBoxEdit(\'' + box.id + '\')"></a></div>');
            boxHtml.push('<div class="col-xs-1"><a href="#" class="glyphicon glyphicon-trash" onclick="app.deleteBox(\'' + box.id + '\')"></a></div>');

            list.append(boxHtml.join(''));
        }

        app.hideModal();
    }, function(error){
        app.hideModal();
        app.showAlert(error);
    });
};

app.showBoxAdd = function() {
    app.switchToPage('pageBox');
    $('#hidBoxId').val('');
    $('#tbBoxName').val('');
};

app.showBoxEdit = function(boxId) {
    app.switchToPage('pageBox');
    app.showModalMessage('Getting box details...');

    $('#hidBoxId').val('');
    $('#tbBoxName').val('');

    var promises = [];
    promises.push(data.getBoxById(boxId));

    Promise.all(promises).then(function(results) {
        var box = results[0];

        $('#hidBoxId').val(box.id);
        $('#tbBoxName').val(box.name);

        app.hideModal();
    }, function(error){
        app.hideModal();
        app.showAlert(error);
    });
};

app.saveBox = function() {
    app.showModalMessage('Saving box...');

    var box = {
        id: $('#hidBoxId').val(),
        name: $('#tbBoxName').val()
    };

    var promises = [];
    promises.push(data.saveBox(box));

    Promise.all(promises).then(function() {
        app.showListOfBoxes();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

app.deleteBox = function(boxId) {
    app.showModalMessage('Deleting box...');

    if (!app.showConfirmation('Are you sure?')) {
        return;
    }

    var promises = [];
    promises.push(data.deleteBoxById(boxId));

    Promise.all(promises).then(function() {
        app.showListOfBoxes();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

/** ITEM **/

app.currentBoxId = null;

app.onCurrentBoxChanged = function() {
    app.currentBoxId = $('#ddlBoxes').val();
    app.showListOfItems(app.currentBoxId);
};

app.showListOfItems = function(boxId) {
    app.switchToPage('pageItems');
    app.showModalMessage('Getting data from server...');

    if (boxId) {
        app.currentBoxId = boxId;
    }

    var boxes = $('#ddlBoxes');
    boxes.empty();
    boxes.append('<option value="">---</option>');

    var items = $('#listItems');
    items.empty();

    var promises = [];
    promises.push(data.getBoxes());
    promises.push(data.getItemsByBoxId(app.currentBoxId));

    Promise.all(promises).then(function (results){
        var listBoxes = results[0];
        var listItems = results[1];

        for (var i = 0; i < listBoxes.length; i++) {
            var box = listBoxes[i];

            var boxHtml = [];
            boxHtml.push('<option ');
            boxHtml.push('value="' + box.id +'" ');
            if (box.id == app.currentBoxId) {
                boxHtml.push('selected="selected"')
            }
            boxHtml.push('>');
            boxHtml.push(box.name);
            boxHtml.push('</option>');

            boxes.append(boxHtml.join(''));
        }

        for(var i = 0; i < listItems.length; i++) {
            var item = listItems[i];

            var itemHtml = [];
            itemHtml.push('<div class="col-xs-10">' + item.name + '</div>');
            itemHtml.push('<div class="col-xs-1"><a href="#" class="glyphicon glyphicon-pencil" onclick="app.showItemEdit(\'' + item.id + '\')"></a></div>');
            itemHtml.push('<div class="col-xs-1"><a href="#" class="glyphicon glyphicon-trash" onclick="app.deleteItem(\'' + item.id + '\')"></a></div>');

            items.append(itemHtml.join(''));
        }

        app.hideModal();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

app.showItemAdd = function() {
    app.switchToPage('pageItem');
    app.showModalMessage('Getting list of boxes...');

    $('#hidItemId').val('');
    $('#tbItemName').val('');

    var boxes = $('#ddlItemBox');
    boxes.empty();
    boxes.append('<option value="">---</option>');

    var promises = [];
    promises.push(data.getBoxes());

    Promise.all(promises).then(function (results) {
        var listBoxes = results[0];

        for (var i = 0; i < listBoxes.length; i++) {
            var box = listBoxes[i];

            var boxHtml = [];
            boxHtml.push('<option ');
            boxHtml.push('value="' + box.id +'" ');
            if (box.id == app.currentBoxId) {
                boxHtml.push('selected="selected"')
            }
            boxHtml.push('>');
            boxHtml.push(box.name);
            boxHtml.push('</option>');

            boxes.append(boxHtml.join(''));
        }

        app.hideModal();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

app.showItemEdit = function(itemId) {
    app.switchToPage('pageItem');
    app.showModalMessage('Getting item details...');

    $('#hidItemId').val('');
    $('#tbItemName').val('');

    var boxes = $('#ddlItemBox');
    boxes.empty();
    boxes.append('<option value="">---</option>');

    var promises = [];
    promises.push(data.getBoxes());
    promises.push(data.getItemById(itemId));

    Promise.all(promises).then(function(results) {
        var listBoxes = results[0];
        var item = results[1];

        for (var i = 0; i < listBoxes.length; i++) {
            var box = listBoxes[i];

            var boxHtml = [];
            boxHtml.push('<option ');
            boxHtml.push('value="' + box.id +'" ');
            if (box.id == app.currentBoxId) {
                boxHtml.push('selected="selected"')
            }
            boxHtml.push('>');
            boxHtml.push(box.name);
            boxHtml.push('</option>');

            boxes.append(boxHtml.join(''));
        }

        $('#hidItemId').val(item.id);
        $('#tbItemName').val(item.name);

        app.hideModal();
    }, function(error){
        app.hideModal();
        app.showAlert(error);
    });
};

app.saveItem = function() {
    app.showModalMessage('Saving item...');

    var item = {
        id: $('#hidItemId').val(),
        name: $('#tbItemName').val(),
        boxId: $('#ddlItemBox').val()
    };

    var promises = [];
    promises.push(data.saveItem(item));

    Promise.all(promises).then(function() {
        app.showListOfItems();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

app.deleteItem = function(itemId) {
    if (!app.showConfirmation('Are you sure?')) {
        return;
    }

    app.showModalMessage('Deleting item...');

    var promises = [];
    promises.push(data.deleteItemById(itemId));

    Promise.all(promises).then(function() {
        app.showListOfItems();
    }, function (error) {
        app.hideModal();
        app.showAlert(error);
    });
};

/** TRANSITION **/

app.currentPage = null;

app.showModalMessage = function (message) {
    var currentPage = app.currentPage;
    app.switchToPage('pageModal');
    $('#modalMessage').text(message);
    app.currentPage = currentPage;
};

app.hideModal = function () {
    app.switchToPage(app.currentPage);
};

app.showAlert = function (message) {
    alert(message);
};

app.showConfirmation = function(message) {
    return confirm(message);
};

app.switchToPage = function(pageId) {
    app.currentPage = pageId;
    $('[id^="page"]').removeClass('hidden').hide();
    $('#' + pageId).show();
};

/** RUN **/

app.run = function () {
    if (!app.isDeviceReady || !app.isDocumentReady) {
        return;
    }

    data.initializeClient();
    app.showListOfBoxes();
};

document.addEventListener('deviceready', function() {
    app.isDeviceReady = true;
    app.run();
}, false);

$(document).ready(function(){
    app.isDocumentReady = true;
    app.run();
});