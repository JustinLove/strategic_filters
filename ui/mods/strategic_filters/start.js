(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  atlasMessage.poll('start', 1000)
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from start'})
  }
  ping()
  window.iconOff = function() {
    atlasMessage.message('icon_atlas', 'toggle_icons', {off: ['commander']})
  }
  window.iconOn = function() {
    atlasMessage.message('icon_atlas', 'toggle_icons', {on: ['commander']})
  }
})()
