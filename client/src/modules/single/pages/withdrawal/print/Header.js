import React from "react";
import logo from "@/assets/logo.png";

const Header = () => (
	<div className="is-flex has-mb-10">
		<div className="has-mr-10 is-ta-center">
			<img src={logo} style={{ width: "30mm" }} alt="logo" />
			<b className="has-mt-05" style={{ display: "block" }}>
				All System Corporation
			</b>
		</div>
		<p>
			<b>All System Corporation Co.,Ltd</b>
			<br />
			บริษัท ออล ซิสเต็ม คอร์ปอเรชั่น จำกัด
			<br />
			124/157 หมู่ที่ 3 ตำบลไทรม้า อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11110
			<br />
			Tel: (66) 2985-9867 | Fax: (66) 2985-9868 | Tax ID: 0125560009503
		</p>
	</div>
);

export default Header;
