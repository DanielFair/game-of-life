import React from 'react';
import logo from './logo.svg';
import './App.css';

class MainGrid extends React.Component {
    constructor(props){
        super(props);

        let width = this.props.width;
        let height = this.props.height;
        let gridArr = [];
        for(var y = 0; y < height; y++){
            let row = [];
            for(var x = 0; x < width; x++){
                let randomState = (Math.random() < 0.5? true: false);
                row.push({
                    alive: randomState,
                    cellX: x,
                    cellY: y
                });
            }
            gridArr.push(row);
        }
        
        this.state = {
            grid: gridArr,
            generation: 0,
            running: false
        };
    }
    componentDidMount = () => {   
        this.start();
        document.body.style.backgroundColor = '#041A2D';
    };

    start = () => {
        if(!this.state.running) {
            this.timer = setInterval(this.advanceGen, 100);
        }
        this.setState({
            running: true
        })
    };
    pause = () => {
        clearInterval(this.timer);
        this.setState({
            running: false
        })
    };
    step = () => {
        this.advanceGen();
    };
    toggleAlive = (x,y) => {
        let toggledGrid = this.state.grid.map((row, rowY) => {
            return row.map((cell, cellX) => {
                if(rowY == y && cellX == x){
                    cell.alive = !cell.alive;
                    return cell;
                }
                return cell;
            })
        })
        this.setState({
            grid: toggledGrid
        });
    }
    clearAll = () => {
        let clearedGrid = this.state.grid.map((row) => {
            return row.map((cell) => {
                cell.alive = false;
                return cell;
            });
        });

        this.setState({
            grid: clearedGrid
        });
    };
    checkNeighbours = (grid, cell) => {
        let neighbourCount = 0;

        // Check for left neighbour
        if(grid[cell.cellY][cell.cellX-1] !== undefined && grid[cell.cellY][cell.cellX-1].alive){
            neighbourCount++;
        }
        //Check for right neighbour
        if(grid[cell.cellY][cell.cellX+1] !== undefined && grid[cell.cellY][cell.cellX+1].alive){
            neighbourCount++;
        }
        //Check for below neighbour
        if(grid[cell.cellY+1] !== undefined && grid[cell.cellY+1][cell.cellX].alive){
            neighbourCount++;
        }
        //Check for below right neighbour
        if(grid[cell.cellY+ 1] !== undefined && grid[cell.cellY+1][cell.cellX+1] !== undefined && grid[cell.cellY+1][cell.cellX+1].alive){
            neighbourCount++;
        }
        //Check for below left neighbour
        if(grid[cell.cellY+ 1] !== undefined && grid[cell.cellY+1][cell.cellX-1] !== undefined && grid[cell.cellY+1][cell.cellX-1].alive){
            neighbourCount++;
        }
        //Check for above neighbour
        if(grid[cell.cellY- 1] !== undefined && grid[cell.cellY-1][cell.cellX].alive){
            neighbourCount++;
        }
        //Check for above right neighbour
        if(grid[cell.cellY- 1] !== undefined && grid[cell.cellY-1][cell.cellX+1] !== undefined && grid[cell.cellY-1][cell.cellX+1].alive){
            neighbourCount++;
        }
        //Check for above left neighbour
        if(grid[cell.cellY- 1] !== undefined && grid[cell.cellY-1][cell.cellX-1] !== undefined && grid[cell.cellY-1][cell.cellX-1].alive){
            neighbourCount++;
        }
        return neighbourCount;
    };
    advanceGen = () => {
        let grid = this.state.grid;

        let advancedGrid = grid.map((row, y, origGrid) => {
            return row.map((cell) => {
                let nextCell = Object.assign({}, cell);
                let cellNeighbours = this.checkNeighbours(origGrid, cell);
                if(cell.alive){
                    if(cellNeighbours < 2) {    
                        nextCell.alive = false;
                    }
                    else if(cellNeighbours == 2 || cellNeighbours == 3){
                        nextCell.alive = true;
                    }
                    else if(cellNeighbours > 3){
                        nextCell.alive = false;
                    }
                    return nextCell;
                }
                else {
                    if(cellNeighbours == 3){
                        nextCell.alive = true;
                    }
                    else{
                        nextCell.alive = false;
                    }
                    return nextCell;
                }
            });
        });

        this.setState({
            grid: advancedGrid,
            generation: this.state.generation+1
        });
    };
    render() {
        let cellArr = this.state.grid.map((row, y) => {
            return row.map((cell, x) => {
                return <Cell alive={cell.alive} id={{x: x, y: y}} onClick={() => this.toggleAlive(x, y)}/>
            });
        });
        return (
            <div>
                <div id='title'>
                    <h1><i>Game of Life Using React.JS</i></h1>
                </div>
                <div className='grid'>
                    {cellArr}
                </div>
                <div id='controls'>
                    <button id='startButton' onClick={this.start}><b>Resume</b></button>
                    <button id='pauseButton' onClick={this.pause}><b>Pause</b></button>
                    <button id='clearAll' onClick={this.clearAll}><b>Clear All</b></button>
                    <button id='step' onClick={this.step}><b>Step Forward</b></button>
                </div>
                <div id='generation'>
                    Generation: {this.state.generation}
                </div>
            </div>
        );
    }
}
const Cell = (props) => {
    let className = (props.alive? 'cellAlive': 'cellDead');
    
    return (
        <div className={className} id={props.id.x+', '+props.id.y} onClick={props.onClick}></div>
    );
}


export default MainGrid;
