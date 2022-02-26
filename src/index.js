import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './index.css';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';

let holding = "";

function Digit(props){
    const [{isOver}, drop] = useDrop( () => ({
        accept: "guessNum",
        drop: () => {
            props.dropped(holding,props.number);
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    }))
    if (!props.lock){
        return(
            <div className="digitCont" ref={drop}>
                {isOver ?
                    <p className="digit" style={{opacity:.2}}>{props.value || holding}</p> :
                    <p className="digit">{props.value}</p>
                }
            </div>   
        )
    }else{
        return(
            <div className="digitCont lock">
                <p className="digit">{props.value}</p>
            </div>   
        )
    }
    
}
class Board extends React.Component{
    renderDigit(i){
        return(<Digit
            key={i}
            number={i}
            value={this.props.numbers[i]}
            lock={this.props.numLock[i]}
            dropped = {(i,n) => this.props.dropped(i,n)}
        />)
    }
    renderBox(){
        let toReturn=[];
        for(let i=0;i<81;i++){
            toReturn.push(this.renderDigit(i))
        }
        return(toReturn);
    }
    render(){
        return(<div id="board">
            {this.renderBox()}
            </div>
        )
    }
}
function GuessNum(props){
    const [{isDragging}, dragRef] = useDrag(() => ({
        type: "guessNum",
        collect: (monitor) => ({
            isDragging:monitor.isDragging(),
        }),
    }));
    return(
        <p
            ref={dragRef} 
            style={{
                opacity: isDragging ? 0.2:1,
            }}
            onMouseDown={(e) => {
                holding = e.target.textContent;
            }}
        >{props.value}</p>
    )
}
class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            numbers:Array(81).fill(null),
            numLock:Array(81).fill(false),
        }
        let start = createGameStart(this.state.numbers);
        this.state.numbers = start.newNums;
        this.state.numLock = start.newNumLock;
    }
    handleDropped(i,n){
        const newNumbers = this.state.numbers.slice();
        newNumbers[n] = +i;
        this.setState({
            numbers:newNumbers,
        });
    }
    render(){
        return(
            <div id="game">
                <Board
                    numbers={this.state.numbers}
                    numLock={this.state.numLock}
                    dropped={(i,n) => this.handleDropped(i,n)}
                />
                <div id="guessOpt">
                    {/* <GuessNum value="0"/> */}
                    <GuessNum value="1"/>
                    <GuessNum value="2"/>
                    <GuessNum value="3"/>
                    <GuessNum value="4"/>
                    <GuessNum value="5"/>
                    <GuessNum value="6"/>
                    <GuessNum value="7"/>
                    <GuessNum value="8"/>
                    <GuessNum value="9"/>
                </div>
            </div>
        )
    }
}
function gameWin(squares){
    const sets = [
        [0,1,2,3,4,5,6,7,8],
        [9,10,11,12,13,14,15,16,17],
        [18,19,20,21,22,23,24,25,26],
        [27,28,29,30,31,32,33,34,35],
        [36,37,38,39,40,41,42,43,44],
        [45,46,47,48,49,50,51,52,53],
        [54,55,56,57,58,59,60,61,62],
        [63,64,65,66,67,68,69,70,71],
        [72,73,74,75,76,77,78,79,80],

        // [0,9,18,27,36,45,54,63,72],
        // [1,10,19,28,37,46,55,64,73],
        // [2,11,20,29,38,47,56,65,74],
        // [3,12,21,30,39,48,57,66,75],
        // [4],
        // [5],
        // [6],
        // [7],
        // [8],
    ]
    
}
function createGameStart(numbers){
    const sets = [
        [0,1,2,3,4,5,6,7,8],
        [9,10,11,12,13,14,15,16,17],
        [18,19,20,21,22,23,24,25,26],
        [27,28,29,30,31,32,33,34,35],
        [36,37,38,39,40,41,42,43,44],
        [45,46,47,48,49,50,51,52,53],
        [54,55,56,57,58,59,60,61,62],
        [63,64,65,66,67,68,69,70,71],
        [72,73,74,75,76,77,78,79,80],
    ]
    let newNums=[];
    let newNumLock = [];
    for (const set of sets){
        const nums = set.map((i) => numbers[i]);
        nums[Math.floor(Math.random()*nums.length)] = Math.floor(Math.random()*9)+1;
        for (const i of nums){
            newNums.push(i);
            newNumLock.push(i ? true : false)
        }
    }
    return {newNums, newNumLock}
}
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <Game/>
    </DndProvider>,
    document.getElementById("root")
)