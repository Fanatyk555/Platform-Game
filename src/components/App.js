import '../App.css';
import React from 'react';

class App extends React.Component {
  state = {
    pos: 0,
    kierunek: "right",
    bullets: [],
    collision_top: false,
    collision_down: false,
    collision_left: false,
    collision_right: false,
    enemy1_kierunek: "left",
    enemy1: 500,
    hero:{
      left: 0,
      top: 0
    }
  }
  handleMove = (e) => {
    const rect = document.getElementById('heroHitbox');
    const object_1 = rect.getBoundingClientRect();
    const rect2 = document.getElementById('ground');
    const object_2 = rect2.getBoundingClientRect();
    const map = document.getElementById('myContainer');
    const object_map = map.getBoundingClientRect();
    const rect3 = document.getElementById('block');
    const object_3 = rect3.getBoundingClientRect();
    const rect4 = document.getElementById('block1');
    const object_4 = rect4.getBoundingClientRect();
    const enemy1 = document.getElementById('enemy1');
    const object_enemy1 = enemy1.getBoundingClientRect();
    const mapObject = [object_2, object_3, object_4, object_enemy1] ;
    const speed = 7;

    //kolizja z obiektami mapy
    for(var i=0;i<mapObject.length;i++){
      if( object_1.top<mapObject[i].top+mapObject[i].height+speed && object_1.top+object_1.height>mapObject[i].top && object_1.left+object_1.width>mapObject[i].left & object_1.left<mapObject[i].left+mapObject[i].width)this.setState({ collision_top: true });
      if( object_1.left<mapObject[i].left+mapObject[i].width+speed && object_1.left+object_1.width>mapObject[i].left && object_1.top+object_1.height>mapObject[i].top && object_1.top<mapObject[i].top+mapObject[i].height)this.setState({ collision_left: true });
      if( object_1.top+object_1.height>mapObject[i].top-speed && object_1.top<mapObject[i].top+mapObject[i].height && object_1.left+object_1.width>mapObject[i].left & object_1.left<mapObject[i].left+mapObject[i].width)this.setState({ collision_down: true });
      if( object_1.left+object_1.width>mapObject[i].left-speed && object_1.left<mapObject[i].left+mapObject[i].width && object_1.top+object_1.height>mapObject[i].top && object_1.top<mapObject[i].top+mapObject[i].height)this.setState({ collision_right: true });
    }
    //kolizja z krańcami mapy
    if( object_1.left<object_map.left+speed)this.setState({ collision_left: true });
    if( object_1.left+object_1.width>object_map.width-speed)this.setState({ collision_right: true });
    if( object_1.top<object_map.top+speed)this.setState({ collision_top: true });
    if( object_1.top+object_1.height>object_map.height-speed)this.setState({ collision_down: true });

    //poruszanie się
    switch(e.key){
      case 'w':
        if(this.state.collision_top===false)this.setState({ hero: { top: this.state.hero.top - speed, left: this.state.hero.left }, collision_down: false });
      break;
      case 'a':
        if(this.state.collision_left===false)this.setState({ hero: { left: this.state.hero.left - speed, top: this.state.hero.top }, collision_right: false, kierunek: "left" });
      break;
      case 's':
        if(this.state.collision_down===false)this.setState({ hero: { top: this.state.hero.top + speed, left: this.state.hero.left }, collision_top: false });
      break;
      case 'd':
        if(this.state.collision_right===false)this.setState({ hero: { left: this.state.hero.left + speed, top: this.state.hero.top }, collision_left: false, kierunek: "right" });
      break;
      case ' ':
        this.shoot();
      break;
      default: return null;
    }
  }
  shoot = () => {
    const bullets = this.state.bullets;
    let left = this.state.hero.left+52;
    let top = this.state.hero.top+35;
    bullets.push([left, top]);
    this.setState({ bullets: [...bullets] })
  }
  bulletMovement = () => {
    const bullets = [...this.state.bullets];
    const map = document.getElementById('myContainer');
    const object_map = map.getBoundingClientRect();
    const newBullets = bullets.map((item, index)=>{
      if(item[0]<object_map.width-20) return [item[0]+10, item[1]];
      else return '';
    });
    this.setState({bullets: newBullets})
  }
  componentDidMount(){
    document.addEventListener("keypress", this.handleMove);
    setInterval(() => {
      this.bulletMovement();
      if(this.state.enemy1_kierunek === "left")this.setState({enemy1: this.state.enemy1 - 7});
      else if(this.state.enemy1_kierunek === "right" )this.setState({enemy1: this.state.enemy1 + 7});
      if(this.state.enemy1 < 10)this.setState({enemy1_kierunek: "right"});
      else if(this.state.enemy1 > 640 )this.setState({enemy1_kierunek: "left"});
    }, 100);
  }
  render(){
    const bulletsMap = this.state.bullets.map((item, index)=>{
      if(item!=='') return <div className="bullet" key={index} style={{left: item[0], top: item[1]}}></div>;
      else return null;
    })
    return(
      <>
        <div className="myContainer" id="myContainer">
          {/* <div className="square hero" style={{left: this.state.hero.left, top: this.state.hero.top}}></div> */}
          {bulletsMap}
          <div className="heroHitbox" id="heroHitbox"style={{left: this.state.hero.left, top: this.state.hero.top}}>
            <div className="head"></div>
            <div className="torso"></div>
            <div className="leftarm"></div>
            <div className="rightarm"></div>
            <div className="leftleg"></div>
            <div className="leftfoot"></div>
            <div className="rightleg"></div>
            <div className="rightfoot"></div>
          </div>
          <div className="map">
            <div className="ground" id="ground" style={{left: "0px", top: "50%"}}/>
            <div className="block" id="block" style={{left: "200px", top: "100px"}}/>
            <div className="block" id="block1" style={{left: "400px", top: "100px"}}/>
            <div className="enemy" id="enemy1" style={{left: this.state.enemy1, top: "275px"}}>
              <div className="HPbar"></div>
              <div className="HP" style={{width: "50px"}}></div>
              <div className="head b"></div>
              <div className="torso b"></div>
              <div className="leftarm b"></div>
              <div className="rightarm b"></div>
              <div className="leftleg b"></div>
              <div className="leftfoot b"></div>
              <div className="rightleg b"></div>
              <div className="rightfoot b"></div>
            </div>
          </div>
        </div>
        
      </>
    )
  }
}

export default App;
