import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersService, User } from '../services/users.service';
import { of, throwError } from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', ['getUsers', 'addUser', 'updateUser', 'deleteUser']);

    await TestBed.configureTestingModule({
      imports: [UsersComponent], // ✅ standalone component must go here
      providers: [{ provide: UsersService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Shreya', email: 'shreya@gmail.com', mobile: '', department: '', role: '', work_location: '' }
    ];
    usersServiceSpy.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(usersServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should set error message if name or email is missing on addUser', () => {
    component.currentUser = { name: '', email: '', mobile: '', department: '', role: '', work_location: '' };

    component.addUser();

    expect(component.errorMessage).toBe('Name and Email are required');
    expect(usersServiceSpy.addUser).not.toHaveBeenCalled();
  });

  it('should call addUser on UsersService when form is valid', () => {
    const newUser: User = { name: 'John', email: 'john@gmail.com', mobile: '', department: '', role: '', work_location: '' };
    component.currentUser = { ...newUser };
    usersServiceSpy.addUser.and.returnValue(of(newUser));
    usersServiceSpy.getUsers.and.returnValue(of([newUser]));

    component.addUser();

    expect(usersServiceSpy.addUser).toHaveBeenCalledWith(newUser);
    expect(usersServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.currentUser.name).toBe('');
  });

  it('should handle addUser error', () => {
    const errorResponse = { error: { error: 'Server error' } };
    component.currentUser = { name: 'John', email: 'john@gmail.com', mobile: '', department: '', role: '', work_location: '' };
    usersServiceSpy.addUser.and.returnValue(throwError(() => errorResponse));

    component.addUser();

    expect(component.errorMessage).toBe('Server error');
  });

});
