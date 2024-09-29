export class Activity {
    _id: string;
    name: string;
    perform_time: string;
    description: string;
    issues: {
      cname: string,
      detail: string
    }
}
