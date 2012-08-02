define([
  "underscore",
  "backbone",
  "cerebral/mvc/Model"
], 
function( _, Backbone, Model ) {  

  describe("cerebral/mvc/Model", function() {

    describe("Model.prototype.constructor", function() {

      it("should not overide defaults with setters", function() {

        /* cannot see any smart way of doing this yet */

        return

        var M = Model.extend({
          defaults: {
            addOne: 1,
            addTwo: 2
          },
          set_addOne: function( n ) { return n + 1 },
          set_addTwo: function( n ) { return n + 2 }
        })

        var model = new M()

        expect( model.get('addOne') ).to.equal( 1 )
        expect( model.get('addTwo') ).to.equal( 2 )

        model.set('addOne', 1)
        model.set('addTwo', 2)

        expect( model.get('addOne') ).to.equal( 2 )
        expect( model.get('addTwo') ).to.equal( 4 )

      })

      it("should properly inherit all getters and setters", function() {
        
        var Turtle = Model.extend({
          defaults: {
            speed: 10,
            damageTaken: 0
          },
          get_speed: function( speed ) { return speed },
          get_color: function() { return 'green' },
          move: function() {
            return 'moves:' + this.get( 'speed' )
          }
        })

        var TeenageMutantNinjaTurtle = Turtle.extend({
          get_speed: function( speed ) { return speed/100 * 200 },
          set_damageTaken: function( dammage ) { return dammage !== 0 ? dammage - 2 : 0 }
        })


        var turtle = new Turtle()
        var ninjaTurtle = new TeenageMutantNinjaTurtle()

        expect( turtle.move() ).to.equal( 'moves:10' )
        expect( ninjaTurtle.move() ).to.equal( 'moves:20' )

        expect( turtle.get('color') ).to.equal( 'green' )
        expect( ninjaTurtle.get('color') ).to.equal( 'green' )

        expect( turtle.get('damageTaken') ).to.equal( 0 )
        expect( ninjaTurtle.get('damageTaken') ).to.equal( 0 )

      })

    })

    describe("Model.prototype.get", function() {

      it("should apply getter if there is one", function() {

        var model = new (Model.extend({
          get_name: function( name ) {
            return 'name:' + name
          }
        }))

        model.set( 'name', 'Laverton' )
        model.set( 'unmutated', 'original' )

        expect( model.attributes['name'] ).to.equal( 'Laverton' )
        expect( model.get('name') ).to.equal( 'name:Laverton' )
        expect( model.get('unmutated') ).to.equal( 'original' )

      })

    })

    describe("Model.prototype.set", function() {

      it("should apply setter if there is one", function() {

        var model = new (Model.extend({
          set_name: function( name ) {
            return 'name:' + name
          },
          set_number: function( number ) {
            return '+47 ' + number
          }
        }))

        model.set( 'name', 'Laverton' )

        expect( model.get('name') ).to.equal( 'name:Laverton' )

        model.set({
          name: 'Christian Laverton',
          number: '951 88 149'
        })

        model.set( 'unmutated', 'original' )

        expect( model.get('name') ).to.equal( 'name:Christian Laverton' )
        expect( model.get('number') ).to.equal( '+47 951 88 149' )
        expect( model.get('unmutated') ).to.equal( 'original' )

      })

    })

  })
  
})