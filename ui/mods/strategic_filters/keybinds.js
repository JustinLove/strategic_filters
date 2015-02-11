[
  ['toggle_surface_icons', ''],
  ['toggle_air_icons', ''],
  ['toggle_orbital_icons', ''],
].forEach(function(array) {
  var name = array[0]
  action_sets.general[name] = function () {
    if (model[name]) model[name]()
  }
  api.settings.definitions.keyboard.settings[name] = {
    title: name.replace(/_/g, ' '),
    type: 'keybind',
    set: 'mods',
    display_group: 'mods',
    display_sub_group: 'Strategic Filters',
    default: array[1],
  }
})
