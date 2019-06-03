export class FirebaseLogsServiceMock {
  search_vehicle_time = {
    search_vehicle_start_time: 0,
    search_vehicle_end_time: 0,
    search_vehicle_time_taken: 0
  };

  confirm_vehicle_time = {
    confirm_vehicle_start_time: 0,
    confirm_vehicle_end_time: 0,
    confirm_vehicle_time_taken: 0
  };

  confirm_preparer_time = {
    confirm_preparer_start_time: 0,
    confirm_preparer_end_time: 0,
    confirm_preparer_time_taken: 0
  };

  add_odometer_reading_time = {
    add_odometer_reading_start_time: 0,
    add_odometer_reading_end_time: 0,
    add_odometer_reading_time_taken: 0
  };

  constructor() {

  }

  logEvent(eventName: string, paramName: string, paramValue: any): Promise<any> {
    return Promise.resolve(true);
  }

  differenceInHMS(start, end): string {
    let date = new Date(end - start);
    let hour = date.getUTCHours();
    let min = date.getUTCMinutes();
    let sec = date.getUTCSeconds();
    return `${hour}:${min}:${sec}`
  }
}
