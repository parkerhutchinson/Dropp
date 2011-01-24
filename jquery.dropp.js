/*
 * Dropp
 * http://github.com/matrushka/Dropp
 * @requires jQuery v1.3 or later
 * 
 * Dropp is a jQuery plugin which replaces regular droprown menus ( <select> elements ) with stylable alternatives.
 *
 * 2010 - Baris Gumustas
 */
(function ($) {
	$.fn.dropp = function (user_settings) {
		var settings = {
			'phrase_on_multiple'      : false,
			'class_dropdown_wrapper'  : 'dropdown_wrapper',
			'class_dropdown_list'     : 'dropdown_list',
			'class_visible_dropdown'  : 'dropdown',
			'class_option_selected'   : 'selected',
			'substract_border_width'  : false
		};
		if (user_settings) {
			$.extend(settings, user_settings);
		}
		return this.each(function () {
			var select, dropdown, list, values, list_width;
			
			select = $(this);
			select.hide();
			select.wrap('<div class="' + settings.class_dropdown_wrapper + '"></div>');
			
			dropdown = $('<a href="#"/>').attr('class', select.attr('class')).addClass(settings.class_visible_dropdown).appendTo(select.parent());
			list = $('<ul/>').addClass(settings.class_dropdown_list).addClass('dropp_dropdown_list').hide().appendTo(select.parent());
			
			// duplicate this line for dropdown opening
			list_width = dropdown.width() + parseInt(dropdown.css("padding-left"), 10) + parseInt(dropdown.css("padding-right"), 10);
			if (settings.substract_border_width) {
				list_width -= (parseInt(list.css('borderLeftWidth'), 10) + parseInt(list.css('borderRightWidth'), 10));
			}
			
			list.css('min-width', list_width);
			list.css('position', 'absolute').css('z-index', '9999');
			
			select.find('option').each(function () {
				var item, list, list_item, link;
				item = $(this);
				list = item.closest('.' + settings.class_dropdown_wrapper).find('ul.dropp_dropdown_list');
				list_item = $('<li/>').appendTo(list);
				link = $('<a href="#"/>').text(item.text());
				
				link.data('option', item);
				list_item.append(link);
				item.data('replacement', link);
				
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') === 'multiple')) {
					if (typeof item.attr('selected') !== undefined && (item.attr('selected') === true || item.attr('selected') === 'selected')) {
						link.addClass(settings.class_option_selected);
					}
				}
				
				// Select Event Listener
				link.bind('select', function (event, trigger_drowndown) {
					var link, wrapper, item, select, dropdown, values;
					link = $(this);
					wrapper = link.closest('.' + settings.class_dropdown_wrapper);
					item = link.data('option');
					select = wrapper.find('select');
					dropdown = wrapper.find('.' + settings.class_visible_dropdown);
					
					if (typeof select.attr('multiple') === 'undefined' || select.attr('multiple') === false) {
						select.find('option:selected').removeAttr('selected');
						dropdown.text($(this).text());
						item.attr('selected', 'selected');
						list.hide();
					} else {
						if (typeof item.attr('selected') === 'undefined' || item.attr('selected') === false) {
							item.attr('selected', 'selected');
							link.addClass(settings.class_option_selected);
						} else {
							item.removeAttr('selected');
							link.removeClass(settings.class_option_selected);
						}
						
						values = [];
						select.find('option:selected').each(function () {
							values.push($(this).text());
						});
						
						if (values.length === 0) {
							if (typeof select.attr('placeholder') !== 'undefined') {
								dropdown.text(select.attr('placeholder'));
							} else {
								dropdown.html('&nbsp;');
							}
						} else {
							if (values.length > 1 && settings.phrase_on_multiple) {
								dropdown.text(settings.phrase_on_multiple);
							} else {
								dropdown.text(values.join(', '));
							}
						}
					}

					if (trigger_drowndown) {
						select.trigger('change');
					}
				});
				// Click Event
				link.click(function () {
					$(this).trigger('select', [true]);
					return false;
				});
			});
			
			// Each loop ends here
			if (select.find('option:selected').length === 0) {
				if (typeof select.attr('placeholder') !== 'undefined') {
					dropdown.text(select.attr('placeholder'));
				} else {
					dropdown.html('&nbsp;');
				}
			} else {
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') === 'multiple')) {
					values = [];
					select.find('option:selected').each(function () {
						values.push($(this).text());
					});
					dropdown.html(values.join(', '));
				} else {
					dropdown.text($(this).find('option:selected').text());
				}
			}
			
			dropdown.click(function () {
				if (list.is(':visible')) {
					list.hide();
					$('ul.dropp_dropdown_list').hide();
				} else {
					$('ul.dropp_dropdown_list').hide();
					list.show();
				}
				return false;
			});
			
			$(document).click(function () {
				list.hide();
			});
			
			$('.' + settings.class_dropdown_wrapper).click(function (event) {
				event.stopPropagation();
			});
		});
	};
}(jQuery));
