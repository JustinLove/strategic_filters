;(function() {
  var lookupPage = function(pageName) {
    var def = $.Deferred()
    var findPage = function(pages) {
      //console.log(pages)
      var page = pages.filter(function(page) {
        return page.url.match('/'+pageName+'.html')
      })[0]
      def.resolve(page)
    }

    $.get('http://127.0.0.1:9999/json').then(findPage)

    return def.promise()
  }

  var message = function(pageName, message, payload) {
    lookupPage(pageName).then(function(page) {
      //console.log(page)
      messagePage(page, message, payload)
    })
  }

  var messagePage = function(page, message, payload) {
    evaluateOnPage(page, invokeHandler(message, payload))
  }

  var invokeHandler = function(message, payload) {
    var args = ''
    if (payload) {
      args = JSON.stringify(payload)
    }
    return 'handlers["' + message + '"](' + args + ')'
  }

  var ws
  var evaluateOnPage = function(page, expression) {
    if (!page) return

    ws = new WebSocket('ws://127.0.0.1:9999/devtools/page/' + page.id);
    ws.onmessage = function(message) {
      //console.log('message')
      if (message && message.data) {
        //console.log('data', JSON.parse(message.data).result.result)
      } else {
        //console.log('message', message)
      }
      ws.close()
      ws = null
    }
    ws.onerror = function(error) {
      console.error('error', error);
      ws.close()
      ws = null
    }
    ws.onopen = function() {
      //console.log('open')

      ws.send(JSON.stringify({
        id: 0,
        method: 'Runtime.evaluate',
        params: {
          expression: expression,
        },
      }))
    }
    ws.onclose = function() {
      //console.log('close')
      ws = null
    }
  }

  var close = function() {
    if (ws) {
      ws.close()
    }
  }

  window.atlasMessage = {
    message: message,
    close: close,
  }
})()
