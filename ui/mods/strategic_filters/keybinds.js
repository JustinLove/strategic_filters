[
  ['toggle_surface_icons', 'ctrl+shift+i'],
  ['toggle_air_icons', 'ctrl+shift+o'],
  ['toggle_orbital_icons', 'ctrl+shift+p'],
  ['focus_air_defense', 'ctrl+shift+f'],
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
