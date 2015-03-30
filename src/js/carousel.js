  // Carousel Extension
  // ===============================
  
      $('.carousel').each(function (index) {
        var $this = $(this)
          , prev        = $this.find('[data-slide="prev"]')
          , next        = $this.find('[data-slide="next"]')
          , $tablist     = $this.find('.carousel-indicators')
          , $tabs        = $this.find('.carousel-indicators li')
          , $tab
          , $tabpanels  = $this.find('.item')
          , $tabpanel
          , i
          , id = 'id_carousel'

        $tablist.attr('role', 'tablist')
        
        $tabs.focus(function() {
          $this.carousel('pause')
        });

        console.log('tabpanels: ' + $tabpanels + " (" + $tabpanels.length + ")")
        for (i = 0; i < $tabpanels.length; i++) {
          $tabpanel = $tabpanels[i]
          $tabpanel.setAttribute('role', 'tabpanel')
          $tabpanel.setAttribute('id', 'tabpanel-' + index + '-' + i)
          $tabpanel.setAttribute('aria-labelledby', 'tab-' + index + '-' + i)
        }

        console.log("role: " + $this.attr('role') + " aria-label: " + $this.attr('aria-label'))

        if (typeof $this.attr('role') !== 'string') {
          $this.attr('role', 'complementary');
          $this.attr('aria-labelledby', id);
          $this.prepend('<h2 id="' + id + '" class="sr-only">Carousel content with ' + $tabpanels.length + ' slides</h2>')
        }  
                
        for (i = 0; i < $tabs.length; i++) {
          var j = i + 1;
          $tab = $tabs[i]
          $tab.setAttribute('role', 'tab')
          $tab.setAttribute('id', 'tab-' + index + '-' + i)
          $tab.setAttribute('aria-controls', 'tabpanel-' + index + '-' + i)
          
          var caption = $this.find('#tabpanel-' + index + '-' + i).find('h3').text()
          
          var tabName = document.createElement('span')
          tabName.setAttribute('class', 'sr-only')
          tabName.innerHTML='Slide ' + j
          if (caption) tabName.innerHTML += ": " +  caption
          
          $tab.appendChild(tabName)
        }
          

        var spanPrev = document.createElement('span')
        spanPrev.setAttribute('class', 'sr-only')
        spanPrev.innerHTML='Slide'

        var spanNext = document.createElement('span')
        spanNext.setAttribute('class', 'sr-only')
        spanNext.innerHTML='Slide'

        prev.attr('role', 'button')
        next.attr('role', 'button')

        prev.append(spanPrev)
        next.append(spanNext)

        $tabs.each(function () {
          var item = $(this)
          if(item.hasClass('active')){
            item.attr({ 'aria-selected': 'true', 'tabindex' : '0' })
          }else{
            item.attr({ 'aria-selected': 'false', 'tabindex' : '-1' })
          }
        })
      })

      var slideCarousel = $.fn.carousel.Constructor.prototype.slide
      $.fn.carousel.Constructor.prototype.slide = function (type, next) {
        var $element = this.$element
          , $active = $element.find('[role=tabpanel].active')
          , $next = next || $active[type]()
          , $tab

//        console.log("type: " + type + " active: " + $active.attr('id') + " next: " + $next.attr('id'))

        $tab = this.$element.find('li[aria-controls=' + $active.attr('id') + ']')
        if ($tab) {
          $tab.attr({'aria-selected':false, 'tabIndex': '-1'})
//          console.log("active: " + $active.attr('id') + " tab: " + $tab.attr('aria-controls'))
        }  

        $tab = this.$element.find('li[aria-controls="' + $next.attr('id') + '"]')
        if ($tab) {
          $tab.attr({'aria-selected':true, 'tabIndex': '0'})
//          console.log("next: " + $next.attr('id') + " tab: " + $tab.attr('aria-controls'))
        }  
        
        slideCarousel.apply(this, arguments)

      $active
        .one('bsTransitionEnd', function () {
//          console.log("active: " + $active.attr('id') + " next: " + $next.attr('id'))
          var $tab
          
          $tab = $element.find('li[aria-controls="' + $active.attr('id') + '"]')
          if ($tab) $tab.attr({'aria-selected':false, 'tabIndex': '-1'})

          $tab = $element.find('li[aria-controls="' + $next.attr('id') + '"]')
          if ($tab) $tab.attr({'aria-selected': true, 'tabIndex': '0'})
          
            //.focus()
       })
      }

     var $this;
     $.fn.carousel.Constructor.prototype.keydown = function (e) {
     
     console.log("keydown: " + e.keyCode + " target: " + e.target.getAttribute('role'))
     
     $this = $this || $(this)
     if(this instanceof Node) $this = $(this)
     
     function selectTab(dir) {
       if (index >= $tabs.length) return
       if (index < 0) return

       $carousel.carousel(dir)
       setTimeout(function () {
            $tabs[index].focus()
            // $this.prev().focus()
       }, 150)      
     }
     
     var $carousel = $(e.target).closest('.carousel')
      , $tabs      = $carousel.find('[role=tab]')
      , k = e.which || e.keyCode
      , index

      console.log("carousel  : " + $carousel + " (" + $carousel[0].tagName + ")")
      console.log("tabs      : " + $tabs + " (" + $tabs.length + ")")

      if (!/(37|38|39|40)/.test(k)) return
      
      index = $tabs.index($tabs.filter('.active'))
      if (k == 37 || k == 38) {                           //  Up
        index--
        selectTab('prev');
      }
      
      if (k == 39 || k == 40) {                          // Down
        index++
        selectTab('next');
      }

      e.preventDefault()
      e.stopPropagation()
    }
    $(document).on('keydown.carousel.data-api', 'li[role=tab]', $.fn.carousel.Constructor.prototype.keydown)
