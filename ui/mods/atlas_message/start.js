(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  atlasMessage.poll('start', 1000)
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from start'})
  }
  ping()
})()
