  // Carousel Extension
  // ===============================
  
      $('.carousel').each(function (index) {
        var $this = $(this)
          , prev        = $this.find('[data-slide="prev"]')
          , next        = $this.find('[data-slide="next"]')
          , $tablist     = $this.find('.carousel-indicators')
          , $tabs        = $this.find('.carousel-indicators li')
          , $tabpanels  = $this.find('.item')
          , $tabpanel
          , i
          , id_title = 'id_title'
          , id_desc  = 'id_desc'

        $tablist.attr('role', 'tablist')
        
        $tabs.focus(function() {
          $this.carousel('pause')
        })

        
        for (i = 0; i < $tabpanels.length; i++) {
          $tabpanel = $tabpanels[i]
          $tabpanel.setAttribute('role', 'tabpanel')
          $tabpanel.setAttribute('id', 'tabpanel-' + index + '-' + i)
          $tabpanel.setAttribute('aria-labelledby', 'tab-' + index + '-' + i)
        }

        if (typeof $this.attr('role') !== 'string') {
          $this.attr('role', 'complementary');
          $this.attr('aria-labelledby', id_title + " " + id_desc);
          $this.prepend('<h2 id="' + id_title + '" class="sr-only">Carousel content with ' + $tabpanels.length + ' slides.</h2>')
          $this.prepend('<p id="' + id_desc + '" class="sr-only">A carousel is a rotating set of images, rotation stops on keyboard focus on carousel tab controls or hovering the mouse pointer over images</p>')
        }  

        $tabs.focus(function(event) {
          $(this).addClass('focus');
        })

        $tabs.blur(function(event) {
          $(this).removeClass('focus')
        })

                
        for (i = 0; i < $tabs.length; i++) {
          var j = i + 1;
          var tab = $tabs[i]
          
          tab.setAttribute('role', 'tab')
          tab.setAttribute('id', 'tab-' + index + '-' + i)
          tab.setAttribute('aria-controls', 'tabpanel-' + index + '-' + i)
          
          var caption = $this.find('#tabpanel-' + index + '-' + i).find('h1').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = $this.find('#tabpanel-' + index + '-' + i).find('h2').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = $this.find('#tabpanel-' + index + '-' + i).find('h3').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = $this.find('#tabpanel-' + index + '-' + i).find('h4').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = $this.find('#tabpanel-' + index + '-' + i).find('h5').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = $this.find('#tabpanel-' + index + '-' + i).find('h6').text()
          if ((typeof caption !== 'string') || (caption.length === 0)) caption = "no title";
          
          console.log("CAPTION: " + caption )
          
          var tabName = document.createElement('span')
          tabName.setAttribute('class', 'sr-only')
          tabName.innerHTML='Slide ' + j
          if (caption) tabName.innerHTML += ": " +  caption
          
          tab.appendChild(tabName)
        }
          

        prev.attr('role', 'button')
        prev.attr('aria-label', 'Previous Slide')
        next.attr('role', 'button')
        next.attr('aria-label', 'Next Slide')

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
          , $active  = $element.find('[role=tabpanel].active')
          , $next    = next || $active[type]()
          , $tab
          , $tab_count = $element.find('[role=tabpanel]').size()
          , $prev_side = $element.find('[data-slide="prev"]')
          , $next_side = $element.find('[data-slide="next"]')
          , $index = 1
          , $prev_index = $tab_count
          , $next_index = 2
          , $id


        $tab = this.$element.find('li[aria-controls=' + $active.attr('id') + ']')
        if ($tab) {
          $tab.attr({'aria-selected':false, 'tabIndex': '-1'})
        }  

        $tab = this.$element.find('li[aria-controls="' + $next.attr('id') + '"]')
        if ($tab) {
          $tab.attr({'aria-selected':true, 'tabIndex': '0'})
        }  

//        console.log("[slide] =================")
//        console.log("[slide]      active: " + $active.attr('id'))
//        console.log("[slide]        next: " + $next)
        
        if ($next && $next.attr('id')) {
          $id = $next.attr('id')
          $index = $id.lastIndexOf("-")
          if ($index >= 0) $index = parseInt($id.substring($index+1), 10) + 1
          
          $prev_index = $index - 1
          if ($prev_index < 1) $prev_index = $tab_count
          
          $next_index = $index + 1
          if ($next_index > $tab_count) $next_index = 1
        }  
        
//        console.log("[slide]   tab_count: " + $tab_count)
//        console.log("[slide]       index: " + $index)
//        console.log("[slide]  prev_index: " + $prev_index)
//        console.log("[slide]  next_index: " + $next_index)
        
        
        $prev_side.attr('aria-label', 'Show slide ' + $prev_index + ' of ' + $tab_count)
        $next_side.attr('aria-label', 'Show slide ' + $next_index + ' of ' + $tab_count)

        
        slideCarousel.apply(this, arguments)

      $active
        .one('bsTransitionEnd', function () {
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
     
     $this = $this || $(this)
     if(this instanceof Node) $this = $(this)
     
     function selectTab(index) {
       if (index >= $tabs.length) return 
       if (index < 0) return

       $carousel.carousel(index)
       setTimeout(function () {
            $tabs[index].focus()
            // $this.prev().focus()
       }, 150)      
     }
     
     var $carousel = $(e.target).closest('.carousel')
      , $tabs      = $carousel.find('[role=tab]')
      , k = e.which || e.keyCode
      , index

      if (!/(37|38|39|40)/.test(k)) return
      
      index = $tabs.index($tabs.filter('.active'))
      if (k == 37 || k == 38) {                           //  Up
        index--
        selectTab(index);
      }
      
      if (k == 39 || k == 40) {                          // Down
        index++
        selectTab(index);
      }

      e.preventDefault()
      e.stopPropagation()
    }
    $(document).on('keydown.carousel.data-api', 'li[role=tab]', $.fn.carousel.Constructor.prototype.keydown)

