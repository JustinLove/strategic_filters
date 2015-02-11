(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  atlasMessage.poll('live_game', 1000)
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from live_game'})
  }
  ping()

  var surfaceLayer = []
  var airLayer = []
  var orbitalLayer = []

  console.log('strategic filter')
  bif.registerBIFReadyCallback(function() {
    surfaceLayer = bif.getFilteredUnitIDs('Land | Naval')
    airLayer = bif.getFilteredUnitIDs('Air').filter(function(id) {
      if (id.match('factory')) {
        surfaceLayer.push(id)
        return false
      } else {
        return true
      }
    })
    orbitalLayer = bif.getFilteredUnitIDs('Orbital')
  })

  var iconToggle = function(value, icons) {
    if (value) {
      atlasMessage.message('icon_atlas', 'toggle_icons', {on: icons})
    } else {
      atlasMessage.message('icon_atlas', 'toggle_icons', {off: icons})
    }
  }

  model.surfaceIconsVisible = ko.observable(true).extend({session: 'surface_icons_visible'})
  model.toggle_surface_icons = function() {
    model.surfaceIconsVisible(!model.surfaceIconsVisible())
  }
  model.surfaceIconsVisible.subscribe(function(value) {
    iconToggle(value, surfaceLayer)
  })

  model.airIconsVisible = ko.observable(true).extend({session: 'air_icons_visible'})
  model.toggle_air_icons = function() {
    model.airIconsVisible(!model.airIconsVisible())
  }
  model.airIconsVisible.subscribe(function(value) {
    iconToggle(value, airLayer)
  })

  model.orbitalIconsVisible = ko.observable(true).extend({session: 'orbital_icons_visible'})
  model.toggle_orbital_icons = function() {
    model.orbitalIconsVisible(!model.orbitalIconsVisible())
  }
  model.orbitalIconsVisible.subscribe(function(value) {
    iconToggle(value, orbitalLayer)
  })
 
  api.Panel.message('', 'inputmap.reload');
})()
