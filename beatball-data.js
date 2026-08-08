// BeatBall data — the game reads this file. Same shape as beatball-data.json.
// To add teams: copy a block, fill it in. Cavs = real. Others = ~ placeholder.
window.BEATBALL_DATA = {
  config: { budget: 100, slots: ["PG","SG","SF","PF","C"], spins: 5 },
  teams: [
    { id:"cle16", team:"Cleveland Cavaliers", season:"2015-16", players:[
      {id:"james",  name:"LeBron James",    eligible:["SF","PF"], capPct:.328, stats:{pts:25.3,tpm:1.1,reb:7.4,ast:6.8,stl:1.4,blk:.6,fg:.520,to:3.3}},
      {id:"irving", name:"Kyrie Irving",    eligible:["PG"],      capPct:.234, stats:{pts:19.6,tpm:1.6,reb:3.0,ast:4.7,stl:1.1,blk:.3,fg:.448,to:2.3}},
      {id:"love",   name:"Kevin Love",      eligible:["PF","C"],  capPct:.281, stats:{pts:16.0,tpm:2.1,reb:9.9,ast:2.4,stl:.8,blk:.5,fg:.419,to:1.8}},
      {id:"jr",     name:"J.R. Smith",      eligible:["SG"],      capPct:.071, stats:{pts:12.4,tpm:2.6,reb:2.8,ast:1.7,stl:1.1,blk:.3,fg:.415,to:.8}},
      {id:"tt",     name:"Tristan Thompson",eligible:["C"],       capPct:.204, stats:{pts:7.8,tpm:0.0,reb:9.0,ast:.8,stl:.5,blk:.6,fg:.588,to:.7}} ]},
    { id:"gsw17", team:"Golden State Warriors", season:"2016-17 ~", players:[
      {id:"curry", name:"Stephen Curry",  eligible:["PG","SG"], capPct:.129, stats:{pts:25.3,tpm:4.1,reb:4.5,ast:6.6,stl:1.8,blk:.2,fg:.468,to:3.0}},
      {id:"klay",  name:"Klay Thompson",  eligible:["SG"],      capPct:.176, stats:{pts:22.3,tpm:3.4,reb:3.7,ast:2.1,stl:.8,blk:.5,fg:.468,to:1.6}},
      {id:"kd",    name:"Kevin Durant",   eligible:["SF","PF"], capPct:.281, stats:{pts:25.1,tpm:1.9,reb:8.3,ast:4.8,stl:1.1,blk:1.6,fg:.537,to:2.2}},
      {id:"dray",  name:"Draymond Green", eligible:["PF","C"],  capPct:.163, stats:{pts:10.2,tpm:1.1,reb:7.9,ast:7.0,stl:2.0,blk:1.4,fg:.418,to:2.3}},
      {id:"zaza",  name:"Zaza Pachulia",  eligible:["C"],       capPct:.031, stats:{pts:6.1,tpm:0.0,reb:5.9,ast:1.9,stl:.9,blk:.3,fg:.535,to:1.4}} ]},
    { id:"chi96", team:"Chicago Bulls", season:"1995-96 ~", players:[
      {id:"mj",     name:"Michael Jordan", eligible:["SG","SF"], capPct:.167, stats:{pts:30.4,tpm:1.1,reb:6.6,ast:4.3,stl:2.2,blk:.5,fg:.495,to:2.4}},
      {id:"pip",    name:"Scottie Pippen", eligible:["SF","PF"], capPct:.127, stats:{pts:19.4,tpm:1.5,reb:6.4,ast:5.9,stl:1.7,blk:.6,fg:.463,to:2.9}},
      {id:"kukoc",  name:"Toni Kukoc",     eligible:["SF","PF"], capPct:.172, stats:{pts:13.1,tpm:1.1,reb:4.0,ast:3.5,stl:.9,blk:.4,fg:.490,to:1.9}},
      {id:"rodman", name:"Dennis Rodman",  eligible:["PF","C"],  capPct:.109, stats:{pts:5.5,tpm:0.0,reb:14.9,ast:2.5,stl:.6,blk:.4,fg:.480,to:1.7}},
      {id:"longley",name:"Luc Longley",    eligible:["C"],       capPct:.121, stats:{pts:9.1,tpm:0.0,reb:5.1,ast:1.9,stl:.4,blk:1.0,fg:.482,to:2.0}} ]},
  ]
};
