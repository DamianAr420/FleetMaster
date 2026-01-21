namespace FleetMaster.API.Entities
{
    public class DriverCreateDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string LicenseNumber { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
