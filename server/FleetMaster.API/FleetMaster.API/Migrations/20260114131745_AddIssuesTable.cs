using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class AddIssuesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsResolved",
                table: "Issues");

            migrationBuilder.RenameColumn(
                name: "Severity",
                table: "Issues",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "ReportedDate",
                table: "Issues",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<int>(
                name: "DriverId",
                table: "Issues",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Issues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Issues",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Issues_DriverId",
                table: "Issues",
                column: "DriverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issues_Drivers_DriverId",
                table: "Issues");

            migrationBuilder.DropIndex(
                name: "IX_Issues_DriverId",
                table: "Issues");

            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Issues");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Issues");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Issues");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Issues",
                newName: "Severity");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Issues",
                newName: "ReportedDate");

            migrationBuilder.AddColumn<bool>(
                name: "IsResolved",
                table: "Issues",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
