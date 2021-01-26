(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("d3-scale")) :
  typeof define === "function" && define.amd ? define(["exports", "d3-scale"], factory) :
  (factory(global.d3 = global.d3 || {}, global.d3));
}(this, function(exports, d3Scale) {
  'use strict';

  function square(x) {
    return x * x;
  }

  // function radial() {
  //   var linear = d3Scale.scale.linear();
  //   // var linear = d3Scale.scaleLinear();

  //   function scale(x) {
  //     return Math.sqrt(linear(x));
  //   }

  //   scale.domain = function(_) {
  //     return arguments.length ? (linear.domain(_), scale) : linear.domain();
  //   };

  //   scale.nice = function(count) {
  //     return (linear.nice(count), scale);
  //   };

  //   scale.range = function(_) {
  //     return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
  //   };

  //   scale.ticks = linear.ticks;
  //   scale.tickFormat = linear.tickFormat;

  //   return scale;
  // }

  function radial() {
    var domain = [0, 1],
        range = [0, 1];
  
    function scale(x) {
      var r0 = range[0] * range[0], r1 = range[1] * range[1];
      return Math.sqrt((x - domain[0]) / (domain[1] - domain[0]) * (r1 - r0) + r0);
    }
  
    scale.domain = function(_) {
      return arguments.length ? (domain = [+_[0], +_[1]], scale) : domain.slice();
    };
  
    scale.range = function(_) {
      return arguments.length ? (range = [+_[0], +_[1]], scale) : range.slice();
    };
  
    scale.ticks = function(count) {
      return d3.scale.linear().domain(domain).ticks(count);
    };

    scale.nice = function(count) {
      return d3.scale.linear().domain(domain).nice();
    };
    
  
    scale.tickFormat = function(count, specifier) {
      return d3.scale.linear().domain(domain).tickFormat(count, specifier);
    };
  
    return scale;
  }

  exports.scale.radial = radial;
  // exports.scaleRadial = radial;

  Object.defineProperty(exports, '__esModule', {value: true});
}));