

function paginate(page,size){
    if(!page || page<=0){
        page=1
    }
    if(!size || size<=0){
        size=2
    }
    let skip=(page-1)*size
    return {skip,limit:size}
}
export default paginate
//page 1 => 0-2
//page 2 => 2-4
//page 3 => 4-6
// equation : (page-1)*size