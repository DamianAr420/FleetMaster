using Microsoft.EntityFrameworkCore;
using FleetMaster.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace FleetMaster.API.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<Log> Logs { get; set; }
    public DbSet<Issue> Issues { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Driver>()
            .HasOne(d => d.User)
            .WithOne()
            .HasForeignKey<Driver>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Issue>()
            .HasOne(i => i.Vehicle)
            .WithMany()
            .HasForeignKey(i => i.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Driver>()
            .HasOne(d => d.AssignedVehicle)
            .WithMany()
            .HasForeignKey(d => d.AssignedVehicleId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}