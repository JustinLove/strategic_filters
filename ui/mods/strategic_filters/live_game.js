(function() {
  /*
  window.ping = function() {
    atlasMessage.message('icon_atlas', 'ping', {hello: 'from live_game'})
  }
  ping()
  */

  var surfaceLayer = []
  var airLayer = []
  var orbitalLayer = []
  var airDefenseFocus = []
  var effectiveVisible = []
  var allIcons = []

  var iconToggle = function(value, icons) {
    if (value) {
      effectiveVisible = _.union(effectiveVisible, icons)
      atlasMessage.message('icon_atlas', 'toggle_icons', {on: icons})
    } else {
      effectiveVisible = _.difference(effectiveVisible, icons)
      atlasMessage.message('icon_atlas', 'toggle_icons', {off: icons})
    }
  }

  var iconFocus = function(icons) {
    effectiveVisible = [].concat(icons)
    var rest = _.difference(allIcons, icons)
    atlasMessage.message('icon_atlas', 'toggle_icons', {off: rest, on: icons})
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

  model.iconFocusMode = ko.observable(null).extend({session: 'icon_focus_mode'})
  model.iconFocusMode.subscribe(function(value) {
    if (value) {
      iconFocus(airDefenseFocus)
    } else {
      iconFocus(allIcons)
    }
  })

  model.focus_air_defense = function() {
    if (model.iconFocusMode() == 'air_defense') {
      model.iconFocusMode(null)
    } else {
      model.iconFocusMode('air_defense')
    }
  }

  model.selection.subscribe(function(sel) {
    if (!sel) return
    if (effectiveVisible.length == 0) return
    if (model.surfaceIconsVisible() && model.airIconsVisible() && model.orbitalIconsVisible() && model.iconFocusMode() === null) return
    var hidden = Object.keys(sel.spec_ids).filter(function(spec) {
      return effectiveVisible.indexOf(spec.match(/\/(\w+).json/)[1]) == -1
    })
    if (hidden.length > 0) {
      model.holodeck.view.selectByTypes('remove', hidden)
    }
  })

  var fixupLayers = function(ids, defaultLayer) {
    ids.forEach(function(id) {
      var spec = bif.getUnitBlueprint(id)
      switch(spec.spawn_layers) {
        case 'WL_Air':
          airLayer.push(id)
          break
        case 'WL_Orbital':
          orbitalLayer.push(id)
          break
        case undefined:
          defaultLayer.push(id)
          break;
        default:
          surfaceLayer.push(id)
          break;
      }
    })
  }

  bif.registerBIFReadyCallback(function strategic_filters_ready() {
    fixupLayers(bif.getFilteredUnitIDs('Land | Naval | Structure'), surfaceLayer)
    // apparently air all spawns on ground
    airLayer = bif.getFilteredUnitIDs('Air & Mobile')
    fixupLayers(bif.getFilteredUnitIDs('Orbital'), orbitalLayer)

    airDefenseFocus = bif.getFilteredUnitIDs('AirDefense | Fighter')

    var ignore = bif.getFilteredUnitIDs('Commander | NoBuild')
    surfaceLayer = _.uniq(_.difference(surfaceLayer, ignore))
    airLayer = _.difference(airLayer, ignore)
    orbitalLayer = _.uniq(_.difference(orbitalLayer, ignore))

    ignore = bif.getFilteredUnitIDs('Commander | NoBuild | Orbital')
    airDefenseFocus = _.uniq(_.difference(airDefenseFocus, ignore))

    allIcons = _.union(surfaceLayer, airLayer, orbitalLayer)
    effectiveVisible = [].concat(allIcons)
    model.surfaceIconsVisible(true)
    model.airIconsVisible(true)
    model.orbitalIconsVisible(true)
    model.iconFocusMode(null)
  })

  api.Panel.message('', 'inputmap.reload');
})()
