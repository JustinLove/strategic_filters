(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  atlasMessage.poll('live_game', 1000)
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from live_game'})
  }
  ping()
  window.iconOff = function() {
    atlasMessage.message('icon_atlas', 'toggle_icons', {off: orbitalLayer})
  }
  window.iconOn = function() {
    atlasMessage.message('icon_atlas', 'toggle_icons', {on: orbitalLayer})
  }

  var groundLayer = []
  var airLayer = []
  var orbitalLayer = []

  console.log('strategic filter')
  bif.registerBIFReadyCallback(function() {
    groundLayer = bif.getFilteredUnitIDs('Land | Naval')
    airLayer = bif.getFilteredUnitIDs('Air | AirDefense').filter(function(id) {
      if (id.match('factory')) {
        groundLayer.push(id)
        return false
      } else {
        return true
      }
    })
    orbitalLayer = bif.getFilteredUnitIDs('Orbital | OrbitalDefense')
  })

})()
