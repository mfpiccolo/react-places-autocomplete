"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Paper = require("material-ui/Paper");

var _Paper2 = _interopRequireDefault(_Paper);

var _Menu = require("material-ui/Menu");

var _lodash = require("lodash.debounce");

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultStyles = require("./defaultStyles");

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Copyright (c) 2016-present, Ken Hibino.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the MIT License (MIT).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * See https://kenny-hibino.github.io/react-places-autocomplete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var PlacesAutocomplete = function (_Component) {
  _inherits(PlacesAutocomplete, _Component);

  function PlacesAutocomplete(props) {
    _classCallCheck(this, PlacesAutocomplete);

    var _this = _possibleConstructorReturn(this, (PlacesAutocomplete.__proto__ || Object.getPrototypeOf(PlacesAutocomplete)).call(this, props));

    _this.state = {
      autocompleteItems: [],
      userInputValue: props.inputProps.value
    };

    _this.autocompleteCallback = _this.autocompleteCallback.bind(_this);
    _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.debouncedFetchPredictions = (0, _lodash2.default)(_this.fetchPredictions, _this.props.debounce);
    _this.clearSuggestions = _this.clearSuggestions.bind(_this);
    return _this;
  }

  _createClass(PlacesAutocomplete, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!window.google) {
        throw new Error("Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library");
      }

      if (!window.google.maps.places) {
        throw new Error("Google Maps Places library must be loaded. Please add `libraries=places` to the src URL. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library");
      }

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK;
    }
  }, {
    key: "autocompleteCallback",
    value: function autocompleteCallback(predictions, status) {
      if (status !== this.autocompleteOK) {
        this.props.onError(status, this.clearSuggestions);
        return;
      }

      // transform snake_case to camelCase
      var formattedSuggestion = function formattedSuggestion(structured_formatting) {
        return {
          mainText: structured_formatting.main_text,
          secondaryText: structured_formatting.secondary_text
        };
      };

      var highlightFirstSuggestion = this.props.highlightFirstSuggestion;


      this.setState({
        autocompleteItems: predictions.map(function (p, idx) {
          return {
            suggestion: p.description,
            placeId: p.place_id,
            active: highlightFirstSuggestion && idx === 0 ? true : false,
            index: idx,
            formattedSuggestion: formattedSuggestion(p.structured_formatting)
          };
        })
      });
    }
  }, {
    key: "fetchPredictions",
    value: function fetchPredictions() {
      var value = this.props.inputProps.value;

      if (value.length) {
        this.autocompleteService.getPlacePredictions(_extends({}, this.props.options, {
          input: value
        }), this.autocompleteCallback);
      }
    }
  }, {
    key: "clearSuggestions",
    value: function clearSuggestions() {
      this.setState({ autocompleteItems: [] });
    }
  }, {
    key: "clearActive",
    value: function clearActive() {
      this.setState({
        autocompleteItems: this.state.autocompleteItems.map(function (item) {
          return _extends({}, item, {
            active: false
          });
        })
      });
    }
  }, {
    key: "selectAddress",
    value: function selectAddress(address, placeId, e) {
      if (e !== undefined) {
        e.preventDefault();
      }
      this.clearSuggestions();
      this.handleSelect(address, placeId);
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(address, placeId) {
      this.props.onSelect ? this.props.onSelect(address, placeId) : this.props.inputProps.onChange(address);
    }
  }, {
    key: "getActiveItem",
    value: function getActiveItem() {
      return this.state.autocompleteItems.find(function (item) {
        return item.active;
      });
    }
  }, {
    key: "selectActiveItemAtIndex",
    value: function selectActiveItemAtIndex(index) {
      var activeName = this.state.autocompleteItems.find(function (item) {
        return item.index === index;
      }).suggestion;
      this.setActiveItemAtIndex(index);
      this.props.inputProps.onChange(activeName);
    }
  }, {
    key: "selectUserInputValue",
    value: function selectUserInputValue() {
      this.clearActive();
      this.props.inputProps.onChange(this.state.userInputValue);
    }
  }, {
    key: "handleEnterKey",
    value: function handleEnterKey() {
      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.handleEnterKeyWithoutActiveItem();
      } else {
        this.selectAddress(activeItem.suggestion, activeItem.placeId);
      }
    }
  }, {
    key: "handleEnterKeyWithoutActiveItem",
    value: function handleEnterKeyWithoutActiveItem() {
      if (this.props.onEnterKeyDown) {
        this.props.onEnterKeyDown(this.props.inputProps.value);
        this.clearSuggestions();
      } else {
        return; //noop
      }
    }
  }, {
    key: "handleDownKey",
    value: function handleDownKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(0);
      } else if (activeItem.index === this.state.autocompleteItems.length - 1) {
        this.selectUserInputValue();
      } else {
        this.selectActiveItemAtIndex(activeItem.index + 1);
      }
    }
  }, {
    key: "handleUpKey",
    value: function handleUpKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1);
      } else if (activeItem.index === 0) {
        this.selectUserInputValue();
      } else {
        this.selectActiveItemAtIndex(activeItem.index - 1);
      }
    }
  }, {
    key: "handleInputKeyDown",
    value: function handleInputKeyDown(event) {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          this.handleEnterKey();
          break;
        case "ArrowDown":
          event.preventDefault(); // prevent the cursor from moving
          this.handleDownKey();
          break;
        case "ArrowUp":
          event.preventDefault(); // prevent the cursor from moving
          this.handleUpKey();
          break;
        case "Escape":
          this.clearSuggestions();
          break;
      }

      if (this.props.inputProps.onKeyDown) {
        this.props.inputProps.onKeyDown(event);
      }
    }
  }, {
    key: "setActiveItemAtIndex",
    value: function setActiveItemAtIndex(index) {
      this.setState({
        autocompleteItems: this.state.autocompleteItems.map(function (item, idx) {
          if (idx === index) {
            return _extends({}, item, { active: true });
          } else {
            return _extends({}, item, { active: false });
          }
        })
      });
    }
  }, {
    key: "handleInputChange",
    value: function handleInputChange(event) {
      var value = event.target.value;

      this.props.inputProps.onChange(value);
      this.setState({ userInputValue: value });
      if (!value) {
        this.clearSuggestions();
        return;
      }
      if (this.props.shouldFetchSuggestions({ value: value })) {
        this.debouncedFetchPredictions();
      }
    }
  }, {
    key: "handleInputOnBlur",
    value: function handleInputOnBlur(event) {
      if (!this.mousedownOnSuggestion) {
        this.clearSuggestions();
      }

      if (this.props.inputProps.onBlur) {
        this.props.inputProps.onBlur(event);
      }
    }
  }, {
    key: "inlineStyleFor",
    value: function inlineStyleFor() {
      var _props = this.props,
          classNames = _props.classNames,
          styles = _props.styles;
      // No inline style if className is passed via props for the element.

      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      if (props.some(function (prop) {
        return classNames.hasOwnProperty(prop);
      })) {
        return {};
      }

      return props.reduce(function (acc, prop) {
        return _extends({}, acc, _defaultStyles2.default[prop], styles[prop]);
      }, {});
    }
  }, {
    key: "classNameFor",
    value: function classNameFor() {
      var classNames = this.props.classNames;

      for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }

      return props.reduce(function (acc, prop) {
        var name = classNames[prop] || "";
        return name ? acc + " " + name : acc;
      }, "");
    }
  }, {
    key: "shouldRenderDropdown",
    value: function shouldRenderDropdown() {
      return this.state.autocompleteItems.length > 0;
    }
  }, {
    key: "getInputProps",
    value: function getInputProps() {
      var _this2 = this;

      var isExpanded = this.shouldRenderDropdown();
      var activeItem = this.getActiveItem();
      var activeItemId = activeItem ? "PlacesAutocomplete__autocomplete-item-" + activeItem.placeId : null;
      var defaultInputProps = {
        type: "text",
        autoComplete: "off",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-controls": "PlacesAutocomplete__autocomplete-container",
        "aria-expanded": isExpanded,
        "aria-haspopup": isExpanded,
        "aria-activedescendant": activeItemId
      };

      return _extends({}, defaultInputProps, this.props.inputProps, {
        onChange: function onChange(event) {
          _this2.handleInputChange(event);
        },
        onKeyDown: function onKeyDown(event) {
          _this2.handleInputKeyDown(event);
        },
        onBlur: function onBlur(event) {
          _this2.handleInputOnBlur(event);
        },
        style: this.inlineStyleFor("input"),
        className: this.classNameFor("input")
      });
    }
  }, {
    key: "handleSuggestionMouseEnter",
    value: function handleSuggestionMouseEnter(index) {
      this.setActiveItemAtIndex(index);
    }
  }, {
    key: "handleSuggestionMouseLeave",
    value: function handleSuggestionMouseLeave() {
      this.mousedownOnSuggestion = false;
      this.clearActive();
    }
  }, {
    key: "handleSuggestionMouseDown",
    value: function handleSuggestionMouseDown(event) {
      event.preventDefault();
      this.mousedownOnSuggestion = true;
    }
  }, {
    key: "handleSuggestionTouchStart",
    value: function handleSuggestionTouchStart() {
      this.mousedownOnSuggestion = true;
    }
  }, {
    key: "handleSuggestionMouseUp",
    value: function handleSuggestionMouseUp() {
      this.mousedownOnSuggestion = false;
    }
  }, {
    key: "handleSuggestionClick",
    value: function handleSuggestionClick(prediction, event) {
      var _this3 = this;

      var suggestion = prediction.suggestion,
          placeId = prediction.placeId;

      this.selectAddress(suggestion, placeId, event);
      setTimeout(function () {
        _this3.mousedownOnSuggestion = false;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var autocompleteItems = this.state.autocompleteItems;

      var inputProps = this.getInputProps();

      return _react2.default.createElement(
        "div",
        {
          id: "PlacesAutocomplete__root",
          style: this.inlineStyleFor("root"),
          className: this.classNameFor("root")
        },
        this.props.hasCustomInput ? _react2.default.cloneElement(this.props.children, _extends({}, inputProps)) : _react2.default.createElement("input", inputProps),
        this.shouldRenderDropdown() && _react2.default.createElement(
          _Paper2.default,
          {
            role: "listbox",
            id: "PlacesAutocomplete__autocomplete-container",
            style: _extends({}, this.inlineStyleFor("autocompleteContainer"), {
              zIndex: 9999
            }),
            className: this.classNameFor("autocompleteContainer")
          },
          autocompleteItems.map(function (p, idx) {
            return _react2.default.createElement(
              "div",
              {
                key: p.placeId,
                id: "PlacesAutocomplete__autocomplete-item-" + p.placeId,
                role: "option",
                onMouseEnter: _this4.handleSuggestionMouseEnter.bind(_this4, idx),
                onMouseLeave: _this4.handleSuggestionMouseLeave.bind(_this4),
                onMouseDown: _this4.handleSuggestionMouseDown.bind(_this4),
                onMouseUp: _this4.handleSuggestionMouseUp.bind(_this4),
                onTouchStart: _this4.handleSuggestionTouchStart.bind(_this4),
                onTouchEnd: _this4.handleSuggestionMouseUp.bind(_this4),
                onClick: _this4.handleSuggestionClick.bind(_this4, p),
                style: p.active ? _this4.inlineStyleFor("autocompleteItem", "autocompleteItemActive") : _this4.inlineStyleFor("autocompleteItem"),
                className: p.active ? _this4.classNameFor("autocompleteItem", "autocompleteItemActive") : _this4.classNameFor("autocompleteItem")
              },
              _this4.props.renderSuggestion({
                suggestion: p.suggestion,
                formattedSuggestion: p.formattedSuggestion
              })
            );
          }),
          this.props.renderFooter && this.props.renderFooter()
        )
      );
    }
  }]);

  return PlacesAutocomplete;
}(_react.Component);

PlacesAutocomplete.propTypes = {
  inputProps: function inputProps(props, propName) {
    var inputProps = props[propName];

    if (!inputProps.hasOwnProperty("value")) {
      throw new Error("'inputProps' must have 'value'.");
    }

    if (!inputProps.hasOwnProperty("onChange")) {
      throw new Error("'inputProps' must have 'onChange'.");
    }
  },
  onError: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  renderSuggestion: _propTypes2.default.func,
  classNames: _propTypes2.default.shape({
    root: _propTypes2.default.string,
    input: _propTypes2.default.string,
    autocompleteContainer: _propTypes2.default.string,
    autocompleteItem: _propTypes2.default.string,
    autocompleteItemActive: _propTypes2.default.string
  }),
  styles: _propTypes2.default.shape({
    root: _propTypes2.default.object,
    input: _propTypes2.default.object,
    autocompleteContainer: _propTypes2.default.object,
    autocompleteItem: _propTypes2.default.object,
    autocompleteItemActive: _propTypes2.default.object
  }),
  options: _propTypes2.default.shape({
    bounds: _propTypes2.default.object,
    componentRestrictions: _propTypes2.default.object,
    location: _propTypes2.default.object,
    offset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    radius: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    types: _propTypes2.default.array
  }),
  debounce: _propTypes2.default.number,
  highlightFirstSuggestion: _propTypes2.default.bool,
  renderFooter: _propTypes2.default.func,
  shouldFetchSuggestions: _propTypes2.default.func.isRequired,
  hasCustomInput: _propTypes2.default.bool.isRequired
};

PlacesAutocomplete.defaultProps = {
  onError: function onError(status, _clearSuggestions) {
    return console.error("[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ", status);
  },
  classNames: {},
  renderSuggestion: function renderSuggestion(_ref) {
    var suggestion = _ref.suggestion;
    return _react2.default.createElement(
      "div",
      null,
      suggestion
    );
  },
  styles: {},
  options: {},
  debounce: 200,
  highlightFirstSuggestion: false,
  shouldFetchSuggestions: function shouldFetchSuggestions() {
    return true;
  }
};

exports.default = PlacesAutocomplete;