import {reOrderArray} from "."

describe ("testing array reordering", () => {

  it("basic tests ", () => {

    let arr = [0,1,2,3,4,5]

    let result = reOrderArray(0, 5, arr)

    expect(result).toEqual([1,2,3,4,5,0])

    result = reOrderArray(5,0, arr)

    expect(result).toEqual([5,0,1,2,3,4])
    

    result = reOrderArray(1,1, arr)

    expect(result).toEqual(arr)

  })



})
