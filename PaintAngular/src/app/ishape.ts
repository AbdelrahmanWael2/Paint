export interface IShape {
    // standard attrs

    name:string;
    id:string;

    xP:number;
    yP:number;

    x:number;
    y:number;

    border: string;
    borderWidth: number;
    borderScaleEnabled: boolean;

    fill: string;
    fillEnabled: boolean;

    rotation: number;

    // additional attributes
    points: number[];
}

// export interface IShape {
//     // standard attrs
    
//     x:number
//     y:number
//     xP:number
//     yP:number
//     id:string
//     name:string

// }