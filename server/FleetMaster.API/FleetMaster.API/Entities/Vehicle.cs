namespace FleetMaster.API.Models;

public class Vehicle
{
    public int Id { get; set; }
    public required string Brand { get; set; }
    public required string Model { get; set; }
    public required string LicensePlate { get; set; }
    public bool IsOperational { get; set; } = true;
    public required string Type { get; set; }
}