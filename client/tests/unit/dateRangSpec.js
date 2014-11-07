describe('dateRange directive', function () {
  var $rootScope, $compile, element;
  beforeEach(module('tracker.directives.dateRange'));
  beforeEach(module('templates-common'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $rootScope.date = new Date('September 30, 2010 15:30:00');
  }));

  function getTitle() {
    return element.find('th').eq(1).find('button').first().text();
  }

  function clickTitleButton() {
    element.find('th').eq(1).find('button').first().click();
  }

  function clickPreviousButton(times) {
    var el = element.find('th').eq(0).find('button').eq(0);
    for (var i = 0, n = times || 1; i < n; i++) {
      el.click();
    }
  }

  function clickNextButton() {
    element.find('th').eq(2).find('button').eq(0).click();
  }

  function getLabelsRow() {
    return element.find('thead').find('tr').eq(1);
  }

  function getLabels() {
    var els = getLabelsRow().find('th'),
        labels = [];
    for (var i = 1, n = els.length; i < n; i++) {
      labels.push( els.eq(i).text() );
    }
    return labels;
  }

  function getWeeks() {
    var rows = element.find('tbody').find('tr'),
        weeks = [];
    for (var i = 0, n = rows.length; i < n; i++) {
      weeks.push( rows.eq(i).find('td').eq(0).first().text() );
    }
    return weeks;
  }

  function getOptions( dayMode ) {
    var tr = element.find('tbody').find('tr');
    var rows = [];

    for (var j = 0, numRows = tr.length; j < numRows; j++) {
      var cols = tr.eq(j).find('td'), days = [];
      for (var i = dayMode ? 1 : 0, n = cols.length; i < n; i++) {
        days.push( cols.eq(i).find('button').text() );
      }
      rows.push(days);
    }
    return rows;
  }

  function clickOption( index ) {
    getAllOptionsEl().eq(index).click();
  }

  function getAllOptionsEl( dayMode ) {
    return element.find('tbody').find('button');
  }

  function expectSelectedElement( index ) {
    var buttons = getAllOptionsEl();
    angular.forEach( buttons, function( button, idx ) {
      expect(angular.element(button).hasClass('btn-info')).toBe( idx === index );
    });
  }

  function triggerKeyDown(element, key, ctrl) {
    var keyCodes = {
      'enter': 13,
      'space': 32,
      'pageup': 33,
      'pagedown': 34,
      'end': 35,
      'home': 36,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'esc': 27
    };
    var e = $.Event('keydown');
    e.which = keyCodes[key];
    if (ctrl) {
      e.ctrlKey = true;
    }
    element.trigger(e);
  }

  describe('', function () {
    beforeEach(function() {
      element = $compile('<datepicker ng-model="date"></datepicker>')($rootScope);
      $rootScope.$digest();
    });

    it('is has a `<table>` element', function() {
      expect(element.find('table').length).toBe(1);
    });

    it('shows the correct title', function() {
      expect(getTitle()).toBe('September 2010');
    });

    it('shows the label row & the correct day labels', function() {
      expect(getLabelsRow().css('display')).not.toBe('none');
      expect(getLabels()).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    it('renders the calendar days correctly', function() {
      expect(getOptions(true)).toEqual([
        ['29', '30', '31', '01', '02', '03', '04'],
        ['05', '06', '07', '08', '09', '10', '11'],
        ['12', '13', '14', '15', '16', '17', '18'],
        ['19', '20', '21', '22', '23', '24', '25'],
        ['26', '27', '28', '29', '30', '01', '02'],
        ['03', '04', '05', '06', '07', '08', '09']
      ]);
    });

    it('renders the week numbers based on ISO 8601', function() {
      expect(getWeeks()).toEqual(['34', '35', '36', '37', '38', '39']);
    });

    it('value is correct', function() {
      expect($rootScope.date).toEqual(new Date('September 30, 2010 15:30:00'));
    });

    it('has `selected` only the correct day', function() {
      expectSelectedElement( 32 );
    });

    it('has no `selected` day when model is cleared', function() {
      $rootScope.date = null;
      $rootScope.$digest();

      expect($rootScope.date).toBe(null);
      expectSelectedElement( null );
    });
  });

});