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
