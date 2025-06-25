const { sortProducts } = require('../common')
const { paginate } = require('../common')

describe('sortProducts', () =>{
    const productExamples = [
        {product_name : 'iphone', id : 150, price : 2000},
        {product_name: 'office chair', id: 300, price : 100},
        {product_name : 'magic deck', id : 120, price : 150}]

    test('sorts by price', () =>{
        expect(sortProducts(productExamples, 'priceASC')).toEqual([
            {product_name: 'office chair', id: 300, price : 100},
            {product_name : 'magic deck', id : 120, price : 150},
            {product_name : 'iphone', id : 150, price : 2000},
        ])

    })

    test('sorts by price descendent', () =>{
        expect(sortProducts(productExamples, 'priceDSC')).toEqual([
                {product_name : 'iphone', id : 150, price : 2000},
                {product_name : 'magic deck', id : 120, price : 150},
                {product_name: 'office chair', id: 300, price : 100}
            ])

    })

    test('sorts by name', () =>{
        expect(sortProducts(productExamples, 'name')).toEqual([
            {product_name : 'iphone', id : 150, price : 2000},
            {product_name : 'magic deck', id : 120, price : 150},
            {product_name: 'office chair', id: 300, price : 100}            
        ])
    })
})

describe('paginate', () =>{
    const productExamples2 = [
        {product_name: 'Bacon', id: 34, price: 637.06, image_url: ''},
        {product_name: 'Ball', id: 49, price: 961.77, image_url: ''},
        {product_name: 'Bike', id: 12, price: 155.17, image_url: ''},
        {product_name: 'Bike', id: 32, price: 32.41, image_url: ''},
        {product_name: 'Car', id: 25, price: 508.64, image_url: ''},
        {product_name: 'Chair', id: 11, price: 135.12, image_url: ''},
        {product_name: 'Cheese', id: 6, price: 817.85, image_url: ''},
        {product_name: 'Mouse', id: 51, price: 168.12, image_url: ''},
        {product_name: 'Pants', id: 18, price: 134.9, image_url: ''},
        {product_name: 'Shoes', id: 5, price: 476.61, image_url: ''}]

    test('page 1 page_size 3', () =>{
        expect(paginate(productExamples2, '1', '3')).toEqual([
            {product_name: 'Bacon', id: 34, price: 637.06, image_url: ''},
            {product_name: 'Ball', id: 49, price: 961.77, image_url: ''},
            {product_name: 'Bike', id: 12, price: 155.17, image_url: ''}
        ])
    })

    test('page 1 page_size 15', () =>{
        expect(paginate(productExamples2, '1', '15')).toEqual([
            {product_name: 'Bacon', id: 34, price: 637.06, image_url: ''},
            {product_name: 'Ball', id: 49, price: 961.77, image_url: ''},
            {product_name: 'Bike', id: 12, price: 155.17, image_url: ''},
            {product_name: 'Bike', id: 32, price: 32.41, image_url: ''},
            {product_name: 'Car', id: 25, price: 508.64, image_url: ''},
            {product_name: 'Chair', id: 11, price: 135.12, image_url: ''},
            {product_name: 'Cheese', id: 6, price: 817.85, image_url: ''},
            {product_name: 'Mouse', id: 51, price: 168.12, image_url: ''},
            {product_name: 'Pants', id: 18, price: 134.9, image_url: ''},
            {product_name: 'Shoes', id: 5, price: 476.61, image_url: ''}
        ])
    })

    test('page 3 page_size 5', () =>{
        expect(paginate(productExamples2, '3', '5')).toEqual([
        ])
    })

    test('page 3 page_size 4', () =>{
        expect(paginate(productExamples2, '3', '4')).toEqual([
            {product_name: 'Pants', id: 18, price: 134.9, image_url: ''},
            {product_name: 'Shoes', id: 5, price: 476.61, image_url: ''}
        ])
    })

})