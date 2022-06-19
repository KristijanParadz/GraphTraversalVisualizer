const vertices=Array.from(document.querySelectorAll(".vertice"))
const start_button = document.querySelector(".start")
const select_algo=document.querySelector(".select-algo")
const speed = document.querySelector(".speed")
const fill = document.querySelector('.fill')
const clear_buttton = document.querySelector("#clear")
let pocetak=vertices[285]
let target=vertices[309]

const filltarget=document.querySelector(".targetfill")

fill.addEventListener("dragstart",dragStart)
fill.addEventListener("dragend",dragEnd)

filltarget.addEventListener("dragstart",fillTargetDragStart)
filltarget.addEventListener("dragend",fillTargetDragEnd)



let target_or_start

function fillTargetDragStart(){
    target_or_start="target"
    setTimeout(()=>{
        this.className= "invisible"
    },0)
}

function fillTargetDragEnd(){
    this.className="targetfill"
}

function dragStart(){
    target_or_start="start"
    setTimeout(()=>{
        this.className= "invisible"
    },0)
}

function dragEnd(){
    this.className="fill"
}

vertices.forEach(empty=>{
    empty.addEventListener("dragover", dragOver)
    empty.addEventListener("dragenter", dragEnter)
    empty.addEventListener("dragleave", dragLeave)
    empty.addEventListener("drop", dragDrop)
})

function dragOver(e){
    e.preventDefault()
}

function dragEnter(e){
    e.preventDefault()
    if (!this.hasChildNodes()){
        this.className +=" hovered"
    }
}

function dragLeave(){
    this.className="vertice"
}

function dragDrop(){
    if(!this.hasChildNodes()){
        if (target_or_start==="start"){
            this.className='vertice'
            pocetak.replaceChildren()
            this.append(fill)
            pocetak=this
        }
        else{
            this.className='vertice'
            target.replaceChildren()
            this.append(filltarget)
            target=this
        }
    }
}




clear_buttton.addEventListener("click",()=>{
    location.reload()
})

start_button.addEventListener("click",()=>{
    start_button.style.backgroundColor="red"
    select_algo.disabled="true"
    speed.disabled="true"
    if (select_algo.options[select_algo.selectedIndex].innerText==="Breadth First Search"){
        let array_of_animations=bfsAlgorithm()
        animateBfs(array_of_animations)
    }

    if (select_algo.options[select_algo.selectedIndex].innerText==="Depth First Search"){
        let array_of_animations=dfsAlgorithm()
        animateDfs(array_of_animations)
    }


}, {once: true})

let pocetni_indeks
let zavrsni_indeks
function bfsAlgorithm(){
    let animations=[{
        vertice_html : pocetak,
        color: "blue"
    }]
    let object_vertices=[]
    for (let i = 0; i<560;i++){
        if (!vertices[i].hasChildNodes()){
            object_vertices.push({
                vertice_html : vertices[i],
                last_vertice : undefined,
                ind : i
            })
        }
        else {
            if(vertices[i].firstElementChild.className==="fill"){
                pocetni_indeks=i
                object_vertices.push({
                    vertice_html : vertices[i],
                    last_vertice : -1,
                    ind : i
                })
            }

            if(vertices[i].firstElementChild.className==="targetfill"){
                zavrsni_indeks=i
                object_vertices.push({
                    vertice_html : vertices[i],
                    last_vertice : undefined,
                    ind : i
                })
            }

        }
    }
    

    queue=[{
        vertice_html : pocetak,
        ind:pocetni_indeks
    }]
    let s
    while(queue!==[]){
        s=queue.shift()
        if(s.ind+1<560 && ((s.ind+1) % 35) !==0  && object_vertices[s.ind+1].last_vertice===undefined){
            
            queue.push({
                vertice_html : vertices[s.ind+1],
                ind: s.ind + 1
            })
            
            object_vertices[s.ind + 1].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind+1],
                color: "blue"
            })
            if(vertices[s.ind+1]===target) break
        }

        if(s.ind-35>=0 && object_vertices[s.ind-35].last_vertice===undefined){
            
            queue.push({
                vertice_html : vertices[s.ind-35],
                ind: s.ind - 35
            })
            
            object_vertices[s.ind - 35].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind-35],
                color: "blue"
            })
            if(vertices[s.ind-35]===target) break
        }

        if(s.ind+35<560 && object_vertices[s.ind+35].last_vertice===undefined){
            
            queue.push({
                vertice_html : vertices[s.ind+35],
                ind: s.ind + 35
            })
            
            object_vertices[s.ind + 35].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind+35],
                color: "blue"
            })
            if(vertices[s.ind+35]===target) break
        }

        if(s.ind-1>=0 && ((s.ind) % 35) !==0 && object_vertices[s.ind-1].last_vertice===undefined){
            
            queue.push({
                vertice_html : vertices[s.ind-1],
                ind: s.ind - 1
            })
            
            object_vertices[s.ind - 1].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind-1],
                color: "blue"
            })
            if(vertices[s.ind-1]===target) break
        }

    }

    let shortest_path_vertice= object_vertices[zavrsni_indeks]
    while (shortest_path_vertice.last_vertice!==-1){
        animations.push({
            vertice_html : shortest_path_vertice.vertice_html,
            color: "green"
        })
        shortest_path_vertice=shortest_path_vertice.last_vertice
    }
    animations.push({
        vertice_html : pocetak,
        color: "green"
    })
    fill.classList.add("notdrag")
    filltarget.classList.add("notdrag")
    return animations
}


function animateBfs(array_of_animations){
    let counter = 200
    let increment=20
    if (speed.options[speed.selectedIndex].innerText === "Normal") increment=50
    else if (speed.options[speed.selectedIndex].innerText === "Slow") increment=100
    array_of_animations.forEach(animation=>{
        setTimeout(()=>{
            if (animation.color==="blue"){
                animation.vertice_html.style.backgroundColor="blue"
            }

            else{
                animation.vertice_html.style.backgroundColor="green"
            }

        },counter)
        counter+=increment
    })
}

let dfs_animations=[]
let dfs_object_vertices=[]


function dfsAlgorithm(){

    
    for (let i = 0; i<560;i++){
        if (!vertices[i].hasChildNodes()){
            dfs_object_vertices.push({
                vertice_html : vertices[i],
                last_vertice : undefined,
                ind : i
            })
        }
        else {
            if(vertices[i].firstElementChild.className==="fill"){
                pocetni_indeks=i
                dfs_object_vertices.push({
                    vertice_html : vertices[i],
                    last_vertice : -1,
                    ind : i
                })
            }

            if(vertices[i].firstElementChild.className==="targetfill"){
                zavrsni_indeks=i
                dfs_object_vertices.push({
                    vertice_html : vertices[i],
                    last_vertice : undefined,
                    ind : i
                })
            }

        }
    }
    
    /*let s=object_vertices[pocetni_indeks]

    while(s.vertice_html!==target){
        if(s.ind+35<560 && object_vertices[s.ind+35].last_vertice===undefined){
            object_vertices[s.ind + 35].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind+35],
                color: "blue"
            })
            s=object_vertices[s.ind+35]
        }
        else if(s.ind+1<560 && ((s.ind+1) % 35) !==0  && object_vertices[s.ind+1].last_vertice===undefined){
            object_vertices[s.ind + 1].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind+1],
                color: "blue"
            })
            s=object_vertices[s.ind+1]
        }

        else if (s.ind-35>=0 && object_vertices[s.ind-35].last_vertice===undefined){
            object_vertices[s.ind - 35].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind-35],
                color: "blue"
            })
            s=object_vertices[s.ind-35]
        }

        else if(s.ind-1>=0 && ((s.ind) % 35) !==0 && object_vertices[s.ind-1].last_vertice===undefined){
            object_vertices[s.ind - 1].last_vertice=object_vertices[s.ind]
            animations.push({
                vertice_html : vertices[s.ind-1],
                color: "blue"
            })
            s=object_vertices[s.ind-1]
        }

    }*/

    /*dfs_object_vertices.forEach(e=>{
        if 
    })*/
    fill.classList.add("notdrag")
    filltarget.classList.add("notdrag")
    dfsVisit(dfs_object_vertices[pocetni_indeks])
    return dfs_animations

}

let is_finished=false

function dfsVisit(dfs_object_vertice){
    dfs_animations.push({
        vertice_html : dfs_object_vertice.vertice_html,
        color: "blue"
    })

    dfs_object_vertices[pocetni_indeks].last_vertice=-1

    if (dfs_object_vertice.vertice_html===vertices[zavrsni_indeks]){
        is_finished=true
        return
    }

    if (dfs_object_vertice.ind+35<560 && dfs_object_vertices[dfs_object_vertice.ind+35].last_vertice===undefined && is_finished===false){
        dfs_object_vertices[dfs_object_vertice.ind+35].last_vertice=dfs_object_vertices[dfs_object_vertice.ind]
        dfsVisit(dfs_object_vertices[dfs_object_vertice.ind+35])
    }

    if(dfs_object_vertice.ind+1<560 && ((dfs_object_vertice.ind+1) % 35) !==0  && dfs_object_vertices[dfs_object_vertice.ind+1].last_vertice===undefined && is_finished===false) {
        dfs_object_vertices[dfs_object_vertice.ind+1].last_vertice=dfs_object_vertices[dfs_object_vertice.ind]
        dfsVisit(dfs_object_vertices[dfs_object_vertice.ind+1])
    }

    if(dfs_object_vertice.ind-35>=0 && dfs_object_vertices[dfs_object_vertice.ind-35].last_vertice===undefined && is_finished===false){
        dfs_object_vertices[dfs_object_vertice.ind-35].last_vertice=dfs_object_vertices[dfs_object_vertice.ind]
        dfsVisit(dfs_object_vertices[dfs_object_vertice.ind-35])
    }

    if(dfs_object_vertice.ind-1>=0 && ((dfs_object_vertice.ind) % 35) !==0 && dfs_object_vertices[dfs_object_vertice.ind-1].last_vertice===undefined && is_finished===false){
        dfs_object_vertices[dfs_object_vertice.ind-1].last_vertice=dfs_object_vertices[dfs_object_vertice.ind]
        dfsVisit(dfs_object_vertices[dfs_object_vertice.ind-1])
    }

    else{
        return
    }

}

function animateDfs(array_of_animations){
    let counter = 200
    let increment=20
    if (speed.options[speed.selectedIndex].innerText === "Normal") increment=50
    else if (speed.options[speed.selectedIndex].innerText === "Slow") increment=100
    array_of_animations.forEach(animation=>{
        setTimeout(()=>{
            if (animation.color==="blue"){
                animation.vertice_html.style.backgroundColor="blue"
            }

            else{
                animation.vertice_html.style.backgroundColor="green"
            }

        },counter)
        counter+=increment
    })
}