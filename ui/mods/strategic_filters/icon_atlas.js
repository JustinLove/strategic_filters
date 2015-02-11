(function() {
  handlers.ping = function(payload) {
    console.log('ping', payload)
  }
  handlers.toggle_icons = function(payload) {
    payload.off && payload.off.forEach(function(icon) {
      $('.'+icon).css('visibility', 'hidden')
    })
    payload.on && payload.on.forEach(function(icon) {
      $('.'+icon).css('visibility', 'visible')
    })
  }
  $('img').each(function() {
    $(this).attr('data-bind', $(this).attr('data-bind').replace('}', ', class: $data }'))
  })
  atlasMessage.poll('icon_atlas', 1000)
})()
