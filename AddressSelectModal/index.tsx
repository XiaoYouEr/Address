import React, { useEffect, useState } from "react";
import styles from "./index.less";
import { addressInfo } from "./addressInfo";
import closeIcon from "@/assets/icons/closeIcon.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.less";

interface AddressProps {
  prefixCls?: string;
  closeModel?: () => void;
  getAddress?: (arg1: { city?: string; district?: string; streetName?: string }) => void;
  addressTitle?: string;
  hierarchy?: number; //层级，表示该地址有几层
  visible?: boolean;
}
interface AddressListType {
  id: number | string;
  code?: string;
  name: string;
  engName?: string;
  isLetter?: boolean;
}
interface titleTab {
  name: string;
  isCurrentSelected: boolean;
  title: string;
  id: number | string;
}
const Address: React.FC<AddressProps> = ({
  prefixCls,
  closeModel,
  getAddress,
  addressTitle,
  hierarchy = 3,
  visible = false,
}) => {
  const [addressSwipe, setAddressSwipe] = useState<any>(null);
  let tabObj = {
    name: "",
    isCurrentSelected: true,
    title: "",
    id: -999,
  };
  const [selectOne, setSelectOne] = useState<titleTab>({ ...tabObj });
  const [selectTwo, setSelectTwo] = useState<titleTab>({ ...tabObj });
  const [selectThree, setSelectThree] = useState<titleTab>({ ...tabObj });

  const [selectOneList, setSelectOneList] = useState<AddressListType[] | null>();
  const [selectTwoList, setSelectTwoList] = useState<AddressListType[] | null>();
  const [selectThreeList, setSelectThreeList] = useState<AddressListType[] | null>();

  const [selectOneListLetter, setSelectOneListLetter] = useState<string[] | null>();
  const [selectTwoListLetter, setSelectTwoListLetter] = useState<string[] | null>();
  const [selectThreeListLetter, setSelectThreeListLetter] = useState<string[] | null>();

  useEffect(() => {
    let handleResult = handleSelectList(addressInfo);
    setSelectOneList(handleResult.resultTabList);
    setSelectOneListLetter(handleResult.letterList);
    initTab();
  }, []);

  const initTab = () => {
    let defaultTabObj = {
      name: "",
      isCurrentSelected: false,
      id: -999,
    };
    let obj1 = Object.assign({ ...defaultTabObj }, { isCurrentSelected: true, title: "选择省" });
    let obj2 = Object.assign({ ...defaultTabObj }, { title: "选择市" });
    let obj3 = Object.assign({ ...defaultTabObj }, { title: "选择区" });
    setSelectOne(obj1);
    setSelectTwo(obj2);
    setSelectThree(obj3);
    setSelectTwoList([]);
    setSelectThreeList([]);
    setSelectTwoListLetter([]);
    setSelectThreeListLetter([]);
  };

  const changeTab = (num: number) => {
    let obj = {
      isCurrentSelected: false,
    };
    let titleTabObj: titleTab = {
      name: "",
      isCurrentSelected: false,
      title: "",
      id: -999,
    };
    let obj1 = { ...titleTabObj },
      obj2 = { ...titleTabObj },
      obj3 = { ...titleTabObj };
    if (num === 1) {
      obj1 = Object.assign({ ...selectOne }, { isCurrentSelected: true });
      obj2 = Object.assign({ ...selectTwo }, { ...obj });
      obj3 = Object.assign({ ...selectThree }, { ...obj });
    } else if (num === 2) {
      obj1 = Object.assign({ ...selectOne }, { ...obj });
      obj2 = Object.assign({ ...selectTwo }, { isCurrentSelected: true });
      obj3 = Object.assign({ ...selectThree }, { ...obj });
    } else if (num === 3) {
      obj1 = Object.assign({ ...selectOne }, { ...obj });
      obj2 = Object.assign({ ...selectTwo }, { ...obj });
      obj3 = Object.assign({ ...selectThree }, { isCurrentSelected: true });
    }
    setSelectOne(obj1);
    setSelectTwo(obj2);
    setSelectThree(obj3);
    addressSwipe.slideTo(num - 1);
  };

  const handleSelectList = (tabList: AddressListType[]): { resultTabList: AddressListType[]; letterList: string[] } => {
    let currentTabList: AddressListType[] = JSON.parse(JSON.stringify(tabList));
    let resultTabList: AddressListType[] = [];
    let letterObj: any = {};
    currentTabList.sort(function(a: { name: string }, b: { name: string }) {
      if (a.name > b.name) {
        return 1;
      } else if (a.name === b.name) {
        return 0;
      } else {
        return -1;
      }
    });
    currentTabList.map((item: AddressListType) => {
      let obj: AddressListType = {
        id: item.id,
        code: item.code || "",
        name: item.name || "",
        engName: item.engName || "",
        isLetter: false,
      };
      let firstLetter = item.name ? item.name[0] : "";
      if (firstLetter && !letterObj[firstLetter]) {
        letterObj[firstLetter] = 1;
        resultTabList.push({
          name: firstLetter,
          id: item.id + firstLetter,
          isLetter: true,
        });
      }
      resultTabList.push(obj);
    });
    let letterList = Object.keys(letterObj);
    return { resultTabList, letterList };
  };

  const getSelectedChildrenList = (num: number, currentId: number | string) => {
    if (num === 1) {
      let currentSelectTwoList: AddressListType[] = [];
      for (let item of addressInfo) {
        if (item.id === currentId) {
          currentSelectTwoList = JSON.parse(JSON.stringify(item.city));
          break;
        }
      }
      let handleResult = handleSelectList(currentSelectTwoList);
      setSelectTwoList(handleResult.resultTabList);
      setSelectTwoListLetter(handleResult.letterList);
    } else if (num === 2) {
      let currentSelectThreeList: AddressListType[] = [];
      let parentList = [];
      for (let item of addressInfo) {
        if (item.id === selectOne.id) {
          parentList = JSON.parse(JSON.stringify(item.city));
          break;
        }
      }
      for (let item of parentList) {
        if (item.id === currentId) {
          currentSelectThreeList = item.country;
          break;
        }
      }
      console.log(selectOne, currentSelectThreeList, "currentSelectThreeList");
      let handleResult = handleSelectList(currentSelectThreeList);
      setSelectThreeList(handleResult.resultTabList);
      setSelectThreeListLetter(handleResult.letterList);
    }
  };

  const checkItem = (num: number, item: AddressListType) => {
    if (item.isLetter) true;
    if (num < hierarchy) {
      getSelectedChildrenList(num, item.id);
    }
    let defaultTabObj = {
      name: "",
      isCurrentSelected: false,
      id: -999,
    };
    switch (num) {
      case 1:
        {
          let obj1 = Object.assign(
            { ...selectOne },
            {
              name: item.name,
              isCurrentSelected: false,
              id: item.id,
            },
          );
          setSelectOne({ ...obj1 });
          let obj2 = Object.assign({ ...selectTwo }, { ...defaultTabObj }, { isCurrentSelected: true });
          setSelectTwo({ ...obj2 });
          let obj3 = Object.assign({ ...selectThree }, { ...defaultTabObj });
          setSelectThree({ ...obj3 });
          setSelectThreeList([]);
        }
        break;
      case 2:
        {
          let obj2 = Object.assign(selectTwo, {
            name: item.name,
            isCurrentSelected: false,
            id: item.id,
          });
          setSelectTwo({ ...obj2 });
          let obj3 = Object.assign({ ...selectThree }, { ...defaultTabObj }, { isCurrentSelected: true });
          setSelectThree({ ...obj3 });
        }
        break;
      case 3:
        {
          setSelectThree(
            Object.assign(selectThree, {
              name: item.name,
              isCurrentSelected: true,
              id: item.id,
            }),
          );
        }
        break;
    }
    if (hierarchy === num) {
      // 关闭窗口
      getAddress && getAddress({ city: selectOne.name, district: selectTwo.name, streetName: selectThree.name });
      handleClose();
    } else {
      setTimeout(() => {
        addressSwipe.slideTo(num);
      }, 0);
    }
  };

  const getTopTab = (tabIndex: number, selectTab: titleTab) => {
    return (
      <span
        className={`${selectTab.isCurrentSelected ? styles.currentTab : ""}`}
        onClick={() => {
          changeTab(tabIndex);
        }}
      >
        {selectTab.name ? selectTab.name : selectTab.title}
      </span>
    );
  };

  const getSwiperContent = (currentTab: number, tabList: AddressListType[], letterList: string[], tab: titleTab) => {
    return (
      <div className={`${styles[prefixCls + "-wrapper-tab"]}`}>
        <div className={styles.listContent}>
          {(tabList || []).map(item => {
            return (
              <div
                key={item.id}
                className={`${item.isLetter ? styles.letter : styles.item} ${
                  item.name === tab.name ? styles.checked : ""
                }`}
                id={item.isLetter ? currentTab + "-selected-" + item.name : undefined}
                onClick={() => {
                  checkItem(currentTab, item);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
        <div className={styles.rightLetter}>
          {(letterList || []).map((item, index) => {
            return (
              <span
                key={index}
                onClick={() => {
                  const id = document.getElementById(currentTab + "-selected-" + item);
                  if (id) {
                    id.scrollIntoView({ block: "start", behavior: "auto" });
                  }
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const handleClose = () => {
    closeModel && closeModel();
    initTab();
  };

  return (
    <div className={`${styles[prefixCls || ""]} ${visible ? "" : styles[prefixCls + "-hidden"]}`}>
      <div className={`${styles[prefixCls + "-content"]}`}>
        <div className={`${styles[prefixCls + "-wrapper"]}`}>
          <div className={`${styles[prefixCls + "-title"]}`}>
            <div className={`${styles[prefixCls + "-title-left"]}`}>{addressTitle || "请选择您的现居地址"}</div>
            <div onClick={handleClose}>
              <img src={closeIcon} className={`${styles[prefixCls + "-title-close"]}`} />
            </div>
            <div className={`${styles[prefixCls + "-title-sub"]}`}>
              {getTopTab(1, selectOne)}

              {selectTwo.name || selectTwo.isCurrentSelected || (selectTwoList || []).length > 0
                ? getTopTab(2, selectTwo)
                : null}
              {selectThree.name || selectThree.isCurrentSelected || (selectThreeList || []).length > 0
                ? getTopTab(3, selectThree)
                : null}
            </div>
          </div>

          <div className={`${styles[prefixCls + "-select"]}`}>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              onSlideChange={() => {
                console.log("onSlideChange");
              }}
              onSwiper={swiper => {
                setAddressSwipe(swiper);
              }}
              observeParents={true}
              observer={true}
            >
              <SwiperSlide>
                {getSwiperContent(1, selectOneList || [], selectOneListLetter || [], selectOne)}
              </SwiperSlide>
              {selectTwoList && selectTwoList.length > 0 ? (
                <SwiperSlide>{getSwiperContent(2, selectTwoList, selectTwoListLetter || [], selectTwo)}</SwiperSlide>
              ) : null}
              {selectThreeList && selectThreeList.length > 0 ? (
                <SwiperSlide>
                  {getSwiperContent(3, selectThreeList, selectThreeListLetter || [], selectThree)}
                </SwiperSlide>
              ) : null}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

Address.defaultProps = {
  prefixCls: "s-address",
  closeModel: () => {},
  getAddress: () => {},
  hierarchy: 3,
  visible: false,
};
export default Address;
