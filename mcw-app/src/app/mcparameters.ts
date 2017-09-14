export class FilterParameters {
  public streamGap:number = 2; // seconds
  public useNoteOff:boolean = false;
  // Add more...
}

// muzicode projection parameters, to add/port as needed
export class ProjectionParameters {
  public countsPerBeat:number = 0;
  public pitchesPerSemitone:number = 1;
  public filterParameters:FilterParameters = new FilterParameters();
}

// InexactParameters
