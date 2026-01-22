using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class fixDriverClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues");

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "Issues",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues");

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "Issues",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
