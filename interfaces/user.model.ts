interface gsUser {
  displaypic: string;
  name?: string;
}

interface gsMongoUser extends gsUser {

}

interface gsSqlUser extends gsUser {
  
}