(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  atlasMessage.poll('icon_atlas', 1000)
  window.ping = function() {
    atlasMessage.message('start', 'ping', {hello: 'from icon_atlas'})
  }
  ping()
})()
