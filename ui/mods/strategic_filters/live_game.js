(function() {
  /*
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from live_game'})
  }
  ping()
  */

  atlasMessage.poll('live_game', 1000)

  var surfaceLayer = []
  var airLayer = []
  var orbitalLayer = []
  var effectiveVisible = []

  var iconToggle = function(value, icons) {
    if (value) {
      effectiveVisible = _.union(effectiveVisible, icons)
      atlasMessage.message('icon_atlas', 'toggle_icons', {on: icons})
    } else {
      effectiveVisible = _.difference(effectiveVisible, icons)
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

  model.selection.subscribe(function(sel) {
    if (!sel) return
    if (model.surfaceIconsVisible() && model.airIconsVisible() && model.orbitalIconsVisible()) return
    var hidden = Object.keys(sel.spec_ids).filter(function(spec) {
      return effectiveVisible.indexOf(spec.match(/\/(\w+).json/)[1]) == -1
    })
    if (hidden.length > 0) {
      model.holodeck.view.selectByTypes('remove', hidden)
    }
  })

  bif.registerBIFReadyCallback(function() {
    surfaceLayer = bif.getFilteredUnitIDs('Land | Naval | Structure')
    airLayer = bif.getFilteredUnitIDs('Air & Mobile')
    orbitalLayer = bif.getFilteredUnitIDs('Orbital')
    effectiveVisible = _.union(surfaceLayer, airLayer, orbitalLayer)
    model.surfaceIconsVisible(true)
    model.airIconsVisible(true)
    model.orbitalIconsVisible(true)
  })

  api.Panel.message('', 'inputmap.reload');
})()
