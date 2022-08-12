function castreamflow(options){
    /*
    var Basin = {
            revision : '2.0',
            QNUMER   :  1.0,	// numerator of slope f(Q) eqn.
            QEXPON   : -0.15,    // exponent of slope f(Q) eqn
            QINTCP   :  2.0,    // offset for slope f(Q) eqn
            RUGOSITY :  0.5     // degree of rugosity (channel interfluve height)
};

Basin.GeoCell = function () {

    this.order     = -1;	// stream order of this cell, -1 means not set
    this.area      = 1;     //  Init as 1 - every basin must be its own contributor!
    this.chanLen   = 0;     // channel length below this cell
    this.exit      = 0;     // side on which stream exits cell
    this.chanElev  = 0;     // elev of channel, in maze units
    this.chanSlope = 0;		// slope of chanel, in maze units
};

Basin.Basin = function ( nCells ) {

    this.nCells = nCells;

    this.maze = null;

    this.rat = null;

    this.geos = [];

    this.firstOrder = [];

    this.elevScale = 0.5 / nCells;

    this.basinArea = nCells * nCells;

    bthis = this;
};

Basin.Basin.prototype = {

    
    construct: function () {

        this.maze = new Maze.Maze( this.nCells, this.nCells, 0, 0 );

        this.maze.build();

        this.maze.dissolveExit( Maze.WEST);

        for ( var i = 0; i < this.maze.row; i++ ) {
            this.geos[i] = [];

            for ( var j = 0; j < this.maze.col; j++ ) {
                this.geos[i][j] = new Basin.GeoCell();
            }
        }

        this.traverseStreams();
    },

   
    traverseStreams: function () {

        this.rat = new MazeRat.MazeRat(this.maze);

        this.rat.initSolveObj(0x80, false, this.getMorphParms);

        this.rat.findSolution(-1, 0);

        this.rat.retraceSteps();

        this.rat.initSolveObj(0x80, true, this.getChanParms);

        this.rat.findSolution(-1, 0);
    },

    
    getMorphParms: function( label, rat,  i,  j, nexi, nexj, pathlen, bSac ) {
        var	x0,y0;
        var curG = bthis.geos[i][j];
        var nexG = (nexi >= 0 && nexj >=  0) ? bthis.geos[nexi][nexj] : undefined;
        x0 = nexj - j + 1;
        y0 = nexi - i + 1;

        curG.exit = Maze.EdgeIndx[y0][x0];

        // if this is a cul-de-sac, then init it to be 1, i.e. first order
        if ( bSac )
            curG.order = 1;

        //curG.chanSlope = (Basin.QNUMER / Math.pow( curG.area + Basin.QINTCP, Basin.QEXPON)) * bthis.elevScale;
        curG.chanSlope = 1 / Math.pow( bthis.basinArea / curG.area, Basin.QEXPON) * bthis.elevScale;

        if (nexG !== undefined) {
            nexG.area += curG.area;

            if (nexG.order === curG.order)
                nexG.order++;
            else if (nexG.order < curG.order)
                nexG.order = curG.order;

            //console.log(label + " i,j: " + i.toFixed(0) + " " + j.toFixed(0) + " nexti,j: " + nexi.toFixed(0) + " " + nexj.toFixed(0) +
            //    " area: " + curG.area + " next_area: " + nexG.area.toFixed(0) + " order: " + curG.order.toFixed(0) +
            //    " next_order: " + nexG.order.toFixed(0) + " chanSlope: " + curG.chanSlope.toFixed(3) + " pathLen: " + pathlen.toFixed(1));
        }
        //else
            //console.log(label + " i,j: " + i.toFixed(0) + " " + j.toFixed(0) + " nexti,j: " + -1 + " " + -1 +
            //    " area: " + curG.area + " next_area: " + -1 + " order: " + curG.order.toFixed(0) +
            //    " next_order: " + -1 + " chanSlope: " +  curG.chanSlope.toFixed(3)  + " pathLen: " + pathlen.toFixed(1));
    },

   
    getChanParms: function( label, rat,  i,  j, previ, prevj, pathlen, bSac ) {

        var curG = bthis.geos[i][j];
        var prevG = (previ >= 0 && prevj >= 0) ? bthis.geos[previ][prevj] : undefined;

        if (prevG !== undefined)
            curG.chanElev = prevG.chanElev + prevG.chanSlope;

        if (bSac) {
            // save position in Sack list
            bthis.firstOrder.push(Maze.Coord(i, j));
        }

        // chan_leng is the length of the mouse's current travels!
        curG.chanLen = pathlen;

        
    }
    /** */
    var pMax = 250;
    var pY = 350;
    var parAlfa = 0.02;
    var m = 4.0;
    var mu = 5.8;
    var sublet = 0;
    for (let i = 0; i < 12; i++) {
        pMax++;
        sublet = pY + parAlfa * (m + mu);
        mu = (6.75*m-7 * pY^3) - (7.71-5 * mu^2) + (1.79-2 ** sublet) + 0.49;
      }
    
    if (sublet > 0) {
        16 ** pY  * (10*M/3.67)**2.4;
    } else {
        return sublet;
    }

}

module.exports = castreamflow
