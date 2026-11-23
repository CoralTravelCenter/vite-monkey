function DataLayerHelper(dataLayer, opt_listener, opt_listenToPast) {
  this.dataLayer_ = dataLayer;
  this.listener_ = opt_listener;
  this.model_ = {};
  this.processors_ = [];
  this.abstractToRealPropertyMap_ = {};
  this.unprocessedMessages_ = [];
  this.isProcessing_ = false;

  var listenToPast = opt_listenToPast === undefined ? true : opt_listenToPast;
  this.registerProcessor('event', this.processEvent_);

  if (listenToPast) {
    this.processMessages_(this.dataLayer_);
  }

  var helper = this;
  var originalPush = dataLayer.push;
  dataLayer.push = function () {
    var messages = Array.prototype.slice.call(arguments, 0);
    var result = originalPush.apply(dataLayer, messages);
    helper.processMessages_(messages);
    return result;
  };
}

DataLayerHelper.prototype.get = function (key) {
  var target = this.model_;
  var parts = key.split('.');
  for (var i = 0; i < parts.length; i++) {
    if (target[parts[i]] === undefined) {
      return undefined;
    }
    target = target[parts[i]];
  }
  return target;
};

DataLayerHelper.prototype.flatten_ = function (obj, target) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      if (val instanceof Array) {
        target[key] = this.flattenArray_(val);
      } else if (typeof val === 'object' && val !== null) {
        target[key] = this.flatten_(val, target[key] || {});
      } else {
        target[key] = val;
      }
    }
  }
  return target;
};

DataLayerHelper.prototype.flattenArray_ = function (arr) {
  var target = [];
  for (var i = 0; i < arr.length; i++) {
    var val = arr[i];
    if (val instanceof Array) {
      target[i] = this.flattenArray_(val);
    } else if (typeof val === 'object' && val !== null) {
      target[i] = this.flatten_(val, {});
    } else {
      target[i] = val;
    }
  }
  return target;
};

DataLayerHelper.prototype.merge_ = function (obj, target) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      if (typeof val === 'object' && val !== null) {
        if (typeof target[key] !== 'object' || target[key] === null) {
          target[key] = val instanceof Array ? [] : {};
        }
        this.merge_(val, target[key]);
      } else {
        target[key] = val;
      }
    }
  }
};

DataLayerHelper.prototype.processMessages_ = function (messages) {
  this.unprocessedMessages_.push.apply(this.unprocessedMessages_, messages);
  if (this.isProcessing_) {
    return;
  }
  this.isProcessing_ = true;
  while (this.unprocessedMessages_.length > 0) {
    var message = this.unprocessedMessages_.shift();
    if (this.listener_) {
      try {
        this.listener_(message);
      } catch (e) {
      }
    }
    var update = {};
    if (typeof message === 'object' && message !== null && !(message instanceof Array)) {
      update = this.flatten_(message, {});
    }
    this.merge_(update, this.model_);
    for (var i = 0; i < this.processors_.length; i++) {
      try {
        var processor = this.processors_[i];
        if (update.hasOwnProperty(processor.key)) {
          processor.callback(update[processor.key], message);
        }
      } catch (e) {
      }
    }
  }
  this.isProcessing_ = false;
};

DataLayerHelper.prototype.registerProcessor = function (key, callback) {
  this.processors_.push({
    key: key,
    callback: callback
  });
  if (this.isProcessing_) {
    return;
  }
  var update = this.get(key);
  if (update !== undefined) {
    try {
      callback(update, undefined);
    } catch (e) {
    }
  }
};

DataLayerHelper.prototype.processEvent_ = function (eventName, message) {
  // Внутренний обработчик событий по умолчанию
};

// Экспортируем класс наружу для современных сборщиков вроде Vite
export default DataLayerHelper;
